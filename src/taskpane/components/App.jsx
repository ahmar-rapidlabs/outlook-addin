import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import HeroList from "./HeroList";
import TextInsertion from "./TextInsertion";
<<<<<<< HEAD
=======
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
>>>>>>> 72283bd (initial commit)
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { insertText } from "../taskpane";
import '../index.css'
import EnterID from "./EnterID";
import CopyCode from './copyCode';
import GetDrafts from "./getDrafts";
const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App = (props) => {
  const { title } = props;
  const styles = useStyles();
  // The list items are static and won't change at runtime,
  // so this should be an ordinary const, not a part of state.
  const listItems = [
    {
      icon: <Ribbon24Regular />,
      primaryText: "Achieve more with Office integrationnnnnnn",
    },
    {
      icon: <LockOpen24Regular />,
      primaryText: "Unlock features and functionality",
    },
    {
      icon: <DesignIdeas24Regular />,
      primaryText: "Create and visualize like a pro",
    },
  ];

  return (
    <div className={styles.root}>
<<<<<<< HEAD

=======
      <Router>
        <Routes>
          <Route path="/taskpane" element={<EnterID />} />
          <Route path="/getdrafts" element={<GetDrafts />} />
        </Routes>
      </Router>
>>>>>>> 72283bd (initial commit)
      {/* <Header logo="assets/logo-filled.png" title={title} message="Welcome" />
      <HeroList message="Discover what this add-in can do for you today!" items={listItems} />
      <div className="text-5xl">Ahmer</div>
      <TextInsertion insertText={insertText} /> */}
      {/* <CopyCode /> */}
<<<<<<< HEAD
      <EnterID />
=======
      {/* <GetDrafts /> */}
>>>>>>> 72283bd (initial commit)
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
