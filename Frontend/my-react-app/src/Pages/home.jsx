import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import Header from "../Components/header.jsx";
// import Sidebar from '../Components/sidebar.jsx';
import Card from "../Components/card.jsx";
import Footer from "../Components/footer.jsx";

///images
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

      <div
        className="flex flex-1 flex-col sm:flex-row bg-cover bg-center"
        // style={{ backgroundImage: "url('../assets/bg_img.svg')" }}
      >
        {/* <Sidebar /> */}
        <main className="flex-1 p-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              icon={faFileLines}
              title="Circulars"
              content="Stay informed with the latest official announcements and updates. Circulars provide crucial information regarding company policies, procedural changes, and important notices."
               cardImage={circularsBg}
              bgColor="bg-blue-200"
              textColor="text-blue-900"
              hoverColor="hover:text-blue-400"
              buttonText="View"
              buttonColor="bg-blue-500"
              buttonTextColor="text-white"
              onClick = {() => navigate('/circulars')}
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
                  <p>
                    Our policies outline the rules and guidelines governing our
                    operations and employee conduct.
                  </p>
                  <p className="text-red-500">
                    Note: These documents are confidential, and unauthorized
                    access or sharing is strictly prohibited.
                  </p>
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
              content="Enhance your skills with step-by-step guides and instructional content. These tutorials cover a range of topics designed to help you navigate various tools and processes efficiently."
              cardImage={tutorialsBg}
              buttonText="View"
              buttonColor="bg-blue-500"
              buttonTextColor="text-white"
              onClick = {() => navigate('/tutorials')}
              backgroundImage={tutorialsBg}
           />
            <Card
              icon={faFilePen}
              title="Applications"
              bgColor="bg-green-200"
              textColor="text-green-900"
              hoverColor="hover:text-green-100"
              content="Access a range of internal applications designed to streamline your work processes. These tools are essential for day-to-day tasks and ensure efficient operation within the organization."
              cardImage={applicationBg}
              buttonText="View"
              buttonColor="bg-blue-500"
              buttonTextColor="text-white"
              onClick = {() => navigate('/applications')}
              backgroundImage={applicationBg}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
