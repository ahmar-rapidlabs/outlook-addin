import os
import webbrowser
import msal
import requests
import json
from dotenv import load_dotenv
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI

load_dotenv()

def generate_access_token(APP_ID, SCOPES, email_verification):
    access_token_cache = msal.SerializableTokenCache()
    
    if os.path.exists(email_verification + ".json"):
        with open(email_verification + ".json", "r") as f:
            access_token_cache.deserialize(f.read())

    client = msal.PublicClientApplication(
        client_id=APP_ID, 
        authority="https://login.microsoftonline.com/common", 
        token_cache=access_token_cache
    )

    accounts = client.get_accounts()
    if accounts:
        token_response = client.acquire_token_silent(SCOPES, account=accounts[0])
        print("Token response from acquire_token_silent:", token_response)
    else:
        token_response = None

    if not token_response:
        print("Attempting to acquire token via device flow...")
        flow = client.initiate_device_flow(scopes=SCOPES)
        if "user_code" not in flow:
            raise ValueError("Failed to create device flow. Check your client ID and scopes.")
        
        print("USER CODE :: " + flow['user_code'])
        webbrowser.open(flow['verification_uri'])
        token_response = client.acquire_token_by_device_flow(flow)
        print("Token response from acquire_token_by_device_flow:", token_response)
        if "access_token" not in token_response:
            raise ValueError("Failed to obtain access token. Please check the user code and try again.")

    with open(email_verification + ".json", 'w') as f:
        f.write(access_token_cache.serialize())
    
    return token_response

def fetch_all_drafts(headers):
    mail_endpoint = "https://graph.microsoft.com/v1.0/me/mailFolders('Drafts')/messages"
    drafts = []
    params = {
        '$select': 'id,subject,bodyPreview,toRecipients'
    }

    while mail_endpoint:
        response = requests.get(mail_endpoint, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            drafts.extend(data['value'])
            mail_endpoint = data.get('@odata.nextLink')
            params = {}  # Clear params to avoid duplication in subsequent requests
        else:
            print(f"Error fetching drafts: {response.status_code}")
            print(response.json())
            return None
    return drafts


def fetch_draft(headers, draft_id):
    mail_endpoint = f"https://graph.microsoft.com/v1.0/me/messages/{draft_id}"
    response = requests.get(mail_endpoint, headers=headers)
    if response.status_code == 200:
        draft = response.json()
        return draft
    else:
        print(f"Error fetching draft {draft_id}: {response.status_code}")
        print(response.json())
        return None

def update_draft(headers, draft_id, subject, body, to_recipients):
    mail_endpoint = f"https://graph.microsoft.com/v1.0/me/messages/{draft_id}"
    draft_payload = {
        "subject": subject,
        "body": {
            "contentType": "Text",
            "content": body
        },
        "toRecipients": to_recipients
    }
    response = requests.patch(mail_endpoint, headers=headers, json=draft_payload)
    if response.status_code == 200:
        print("Draft updated successfully.")
    else:
        print(f"Error updating draft: {response.status_code}")
        print(response.json())

def send_email(headers, draft_id):
    mail_endpoint = f"https://graph.microsoft.com/v1.0/me/messages/{draft_id}/send"
    response = requests.post(mail_endpoint, headers=headers)
    if response.status_code == 202:
        print("Email sent successfully.")
    else:
        print(f"Error sending email: {response.status_code}")
        print(response.json())

def query_llm(agent, prompt):
    response = agent.query(prompt)
    return response.get_response() if hasattr(response, 'get_response') else str(response)

if __name__ == '__main__':
    APP_ID = os.getenv("APP_ID")
    SCOPES = ["User.Read", "Mail.Read", "Mail.ReadWrite", "Mail.Send"]
    email_verification = input("Please Enter your Email Address :: ")

    try:
        access_token = generate_access_token(APP_ID, SCOPES, email_verification)
        print("Access token obtained successfully:\n", access_token['access_token'])
    except ValueError as e:
        print(e)
        exit(1)

    if access_token is None:
        print("Failed to obtain access token. Exiting...")
        exit(1)

    headers = {
        'Authorization': f'Bearer {access_token["access_token"]}',
        'Content-Type': 'application/json'
    }

    drafts = fetch_all_drafts(headers)
    if drafts:
        for i, draft in enumerate(drafts):
            print(f"Draft {i+1}:")
            print("Subject:", draft['subject'])
            print("Body Preview:", draft['bodyPreview'])
            to_addresses = [recipient['emailAddress']['address'] for recipient in draft.get('toRecipients', [])]
            print("To:", ", ".join(to_addresses) if to_addresses else "No recipients")
            print("-" * 50)
        
        draft_num = int(input("Enter the number of the draft you want to edit: ")) - 1
        if 0 <= draft_num < len(drafts):
            draft_id = drafts[draft_num]['id']
            draft = fetch_draft(headers, draft_id)
            if draft:
                base_context = """Purpose: You are an Artificial Intelligence Engineer and your job is to build AI tools for your clients.
                Your team members can call you for a meeting. Your manager can assign you tasks or call you for discussions.
                Do not give any answer if you do not have enough information.
                Act like a human. Do not ask anything or offer your help like a bot. Do not extend your help or services at the end of each response.
                Be a little friendly.
                Be concise.
                Do not mention about who you are.
                You will get emails and you have to generate replies to them.
                You have to generate the replies after analyzing the emails.
                Always be positive."""

                openai_api_key = os.getenv("OPENAI_API_KEY")
                llm = OpenAI(model="gpt-4", api_key=openai_api_key)
                agent = ReActAgent.from_tools([], llm=llm, verbose=True, context=base_context)
                
                while True:
                    prompt = input("Enter your prompt to edit the draft: ")
                    edited_body = query_llm(agent, f"Draft body: {draft['body']['content']}\nPrompt: {prompt}")
                    print("Edited Draft Body:", edited_body)
                    
                    choice = input("Do you want to edit the draft again? (yes/no): ").strip().lower()
                    if choice == 'no':
                        send_choice = input("Do you want to send this draft? (yes/no): ").strip().lower()
                        if send_choice == 'yes':
                            update_draft(headers, draft_id, draft['subject'], edited_body, draft['toRecipients'])
                            send_email(headers, draft_id)
                        break
        else:
            print("Invalid draft number.")
