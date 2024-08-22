import os
<<<<<<< HEAD
import secrets
=======
>>>>>>> 72283bd (initial commit)
import webbrowser
import msal
import requests
import time
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta
<<<<<<< HEAD
from flask import Flask, request, jsonify, session
=======
from flask import Flask, request, jsonify
>>>>>>> 72283bd (initial commit)
from flask_cors import CORS
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI
import threading

load_dotenv()

app = Flask(__name__)
<<<<<<< HEAD
CORS(app, resources={r"/*": {"origins": "https://localhost:3000"}})
# secret_key = secrets.token_hex(16)
last_check_time = None

=======
CORS(app)

last_check_time = None
>>>>>>> 72283bd (initial commit)

def generate_access_token(APP_ID, SCOPES, email_verification):
    access_token_cache = msal.SerializableTokenCache()
    
    if os.path.exists(email_verification + ".json"):
        with open(email_verification + ".json", "r") as f:
            access_token_cache.deserialize(f.read())
    print("before client")
    client = msal.PublicClientApplication(
        client_id=APP_ID, 
        authority="https://login.microsoftonline.com/common", 
        token_cache=access_token_cache
    )
    print("after client")

    accounts = client.get_accounts()
    if accounts:
        token_response = client.acquire_token_silent(SCOPES, account=accounts[0])
        print("Token response from acquire_token_silent:", token_response)
        return token_response, "Already Authenticated", None, None, None, None
    else:
        print("Attempting to acquire token via device flow...")
        flow = client.initiate_device_flow(scopes=SCOPES)
        if "user_code" not in flow:
            raise ValueError("Failed to create device flow. Check your client ID and scopes.")
        
        print("before my check")
        user_code = flow['user_code']
        print("USER CODE :: " + user_code)
        webbrowser.open(flow['verification_uri'])
        print("after my check")

        # Return user_code immediately
        return None, user_code, client, flow, access_token_cache, email_verification

def complete_device_flow(client, flow, access_token_cache, email_verification):
    token_response = client.acquire_token_by_device_flow(flow)
    print("Token Response: ", token_response)
    if "access_token" not in token_response:
        raise ValueError("Failed to obtain access token. Please check the user code and try again.")
    print("before opening acces token json")
    with open(email_verification + ".json", 'w') as f:
        f.write(access_token_cache.serialize())
    
    print("after opening acces token json")
    return token_response

def fetch_email_ids(headers, last_check_time):
    mail_endpoint = "https://graph.microsoft.com/v1.0/me/messages"
    params = {
        '$filter': f"receivedDateTime gt {last_check_time} and isDraft eq false",
        '$orderby': 'receivedDateTime desc',
        '$select': 'id,receivedDateTime'
    }
    response = requests.get(mail_endpoint, headers=headers, params=params)
    if response.status_code == 200:
        emails = response.json()['value']
        return emails
    else:
        print(f"Error fetching email IDs: {response.status_code}")
        print(response.json())
        return None

def fetch_email(headers, email_id):
    mail_endpoint = f"https://graph.microsoft.com/v1.0/me/messages/{email_id}"
    response = requests.get(mail_endpoint, headers=headers)
    if response.status_code == 200:
        email = response.json()
        return email
    else:
        print(f"Error fetching email {email_id}: {response.status_code}")
        print(response.json())
        return None

def query_llm(agent, prompt):
    response = agent.query(prompt)
    return response.get_response() if hasattr(response, 'get_response') else str(response)

def create_draft(headers, recipient_email, subject, body):
    mail_endpoint = "https://graph.microsoft.com/v1.0/me/messages"
    draft_payload = {
        "subject": subject,
        "body": {
            "contentType": "Text",
            "content": body
        },
        "toRecipients": [
            {
                "emailAddress": {
                    "address": recipient_email
                }
            }
        ]
    }
    response = requests.post(mail_endpoint, headers=headers, json=draft_payload)
    if response.status_code == 201:
        print("Draft created successfully.")
    else:
        print(f"Error creating draft: {response.status_code}")
        print(response.json())

def poll_for_new_emails(headers, agent, interval=60):
    global last_check_time
    if last_check_time is None:
        last_check_time = (datetime.utcnow() - timedelta(minutes=1)).isoformat() + 'Z'
    
    while True:
        email_data = fetch_email_ids(headers, last_check_time)
        if email_data:
            latest_email_time = last_check_time

            for email in email_data:
                email_id = email['id']
                email_time = email['receivedDateTime']

                if email_time > last_check_time:
                    detailed_email = fetch_email(headers, email_id)
                    if detailed_email:
                        print("New Email Received!")
                        print("Subject:", detailed_email['subject'])
                        from_email = detailed_email.get('from', {}).get('emailAddress', {}).get('address', 'Unknown Sender')
                        print("From:", from_email)
                        print("Received:", email_time)
                        print("Body Preview:", detailed_email['bodyPreview'])
                        print("-" * 50)

                        email_body = detailed_email['bodyPreview']
                        prompt = f"Email from {from_email} with subject '{detailed_email['subject']}' and body: {email_body}"
                        result = query_llm(agent, prompt)
                        print("Chatbot Response:", result)
                        print("-" * 50)

                        create_draft(headers, from_email, detailed_email['subject'], result)

                        if email_time > latest_email_time:
                            latest_email_time = email_time

            last_check_time = latest_email_time

        time.sleep(interval)

@app.route('/start_polling', methods=['POST'])
def start_polling():
    data = request.json
    APP_ID = data['APP_ID']
    SCOPES = data['SCOPES']
    email_verification = data['email_verification']
    
    token_response, user_code, client, flow, access_token_cache, email_verification = generate_access_token(APP_ID, SCOPES, email_verification)

    if token_response is None:
        # Return user_code immediately
        response = {'status': 'Polling started', 'user_code': user_code}
        print("Response to frontend:", response)  # Debug print
        threading.Thread(target=complete_device_flow, args=(client, flow, access_token_cache, email_verification)).start()
        return jsonify(response), 200

    headers = {
        'Authorization': f'Bearer {token_response["access_token"]}',
        'Content-Type': 'application/json'
    }
    threading.Thread(target=poll_for_new_emails, args=(headers, agent)).start()

    response = {'status': 'Polling started', 'user_code': user_code}
<<<<<<< HEAD
    # print("Response to frontend:", response)  # Debug print
    return jsonify(response), 200

@app.route('/fetch_drafts', methods=['POST'])
def fetch_all_drafts():
    data = request.json
    print("data: ", data)
    APP_ID = data['APP_ID']
    SCOPES = data['SCOPES']
    email_verification = data['email_verification']
    print("fetch drafts email: ", email_verification)
    token_response, _, _, _, _, _ = generate_access_token(APP_ID, SCOPES, email_verification)

    mail_endpoint = "https://graph.microsoft.com/v1.0/me/mailFolders('Drafts')/messages"
    drafts = []
    params = {
        '$select': 'id,subject,bodyPreview,toRecipients'
    }
    headers = {
        'Authorization': f'Bearer {token_response["access_token"]}',
        'Content-Type': 'application/json'
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
    print(drafts)
    return jsonify(drafts), 200

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

=======
    print("Response to frontend:", response)  # Debug print
    return jsonify(response), 200

>>>>>>> 72283bd (initial commit)
if __name__ == '__main__':
    openai_api_key = "sk-proj-aQ2kHLlHy08BFmeUGAQzT3BlbkFJ5agbhM31XnftQGjC1qDB"
    llm = OpenAI(model="gpt-4", api_key=openai_api_key)
    agent = ReActAgent.from_tools([], llm=llm, verbose=True, context="""Your name is Haseeb. You are an Artificial Intelligence Engineer, specializing in building AI tools for clients. You receive emails from various people including friends, colleagues, and managers. Your task is to generate replies to these emails.
                        
                        Guidelines for replies:
                        
                        Be concise and positive.
                        Avoid extending sentences unnecessarily.
                        Ensure the replies sound human and not like a bot.
                        Do not offer additional help or services unless specifically requested.
                        Maintain a friendly tone.
                        Respond based on the content and context of each email.
                        
                        You should never:

                        Mention that you are an AI.
                        Provide information if you don't have enough context.
                        Offer unsolicited help.
                        
                        Remember, your goal is to come across as a human named Haseeb in all your replies.""")
    app.run(port=5000, debug=True)
