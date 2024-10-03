import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Components/header.jsx";
import Card from "../Components/card.jsx";
import Footer from "../Components/footer.jsx";

import applicationBg from "../assets/applications.svg";
import policiesBg from "../assets/policies.svg";
import tutorialsBg from "../assets/tuteorials.svg";
import circularsBg from "../assets/circulars.svg";

import {
  faFileLines,
  faFileShield,
  faPersonChalkboard,
  faFilePen,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 h-full">
          <Card
            icon={faFileLines}
            title="Circulars"
            content="Stay updated with official announcements, policy changes, and important notices."
            cardImage={circularsBg}
            bgColor="bg-blue-200"
            textColor="text-blue-900"
            hoverColor="hover:text-blue-400"
            buttonText="View"
            buttonColor="bg-blue-500"
            buttonTextColor="text-white"
            onClick={() => navigate('/circulars')}
            backgroundImage={circularsBg}
          />
          
          <Card
            icon={faFileShield}
            title="Policies"
            bgColor="bg-red-200"
            textColor="text-red-900"
            hoverColor="hover:text-red-400"
            content={
              <>
                <p>Our policies define the rules for operations and employee conduct.</p>
                <p className="text-red-500 text-xs">Note: Confidential, Don't try to copy</p>
              </>
            }
            cardImage={policiesBg}
            buttonText="View"
            buttonColor="bg-blue-500"
            buttonTextColor="text-white"
            onClick={() => navigate('/policies')}
            backgroundImage={policiesBg}
          />

          <Card
            icon={faPersonChalkboard}
            title="Tutorials"
            bgColor="bg-yellow-200"
            textColor="text-yellow-900"
            hoverColor="hover:text-yellow-100"
            content="Boost your skills with step-by-step tutorials on various tools and processes."
            cardImage={tutorialsBg}
            buttonText="View"
            buttonColor="bg-blue-500"
            buttonTextColor="text-white"
            onClick={() => navigate('/tutorials')}
            backgroundImage={tutorialsBg}
          />

          <Card
            icon={faFilePen}
            title="Applications"
            bgColor="bg-green-200"
            textColor="text-green-900"
            hoverColor="hover:text-green-100"
            content="Access internal applications that streamline daily tasks and operations."
            cardImage={applicationBg}
            buttonText="View"
            buttonColor="bg-blue-500"
            buttonTextColor="text-white"
            onClick={() => navigate('/applications')}
            backgroundImage={applicationBg}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;