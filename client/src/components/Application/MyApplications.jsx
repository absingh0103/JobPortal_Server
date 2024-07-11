import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [editingMode, setEditingMode] = useState(null);

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleEnableEdit = (applicationId) => {
    //Here We Are Giving Id in setEditingMode because We want to enable only that job whose ID has been send.
    console.log(applicationId);
    setEditingMode(applicationId);
  };

  //Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  //Function For Updating The Job
  const handleUpdateApplication = async (applicationId) => {
    const updatedApplication = applications.find(
      (application) => application._id === applicationId
    );
    await axios
      .put(`/api/v1/application/update/${applicationId}`, updatedApplication, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const handleInputChange = (applicationId, field, value) => {
    // Update the job object in the jobs state with the new value
    setApplications((prevApplication) =>
      prevApplication.map((application) =>
        application._id === applicationId
          ? { ...application, [field]: value }
          : application
      )
    );
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400";

      case "Review":
        return "bg-lime-600 ";

      case "Selected":
        return "bg-green-400 ";

      case "Rejected":
        return "bg-red-600 ";

      default:
        return "bg-yellow-400";
    }
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length <= 0 ? (
            <>
              {" "}
              <h4>No Applications Found...</h4>{" "}
            </>
          ) : (
            applications.map((element) => {
              return (
                <JobSeekerCard
                  element={element}
                  key={element._id}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                  statusColor={statusColor}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Job Seekers</h1>
          {applications.length <= 0 ? (
            <>
              <h4>No Applications Found...</h4>
            </>
          ) : (
            applications.map((element) => {
              return (
                <EmployerCard
                  element={element}
                  key={element._id}
                  openModal={openModal}
                  editingMode={editingMode}
                  setEditingMode={setEditingMode}
                  handleUpdateApplication={handleUpdateApplication}
                  handleEnableEdit={handleEnableEdit}
                  handleDisableEdit={handleDisableEdit}
                  handleInputChange={handleInputChange}
                  statusColor={statusColor}
                />
              );
            })
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({
  element,
  deleteApplication,
  openModal,
  statusColor,
}) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_areaSeeker">
          <span class={statusColor(element.status)}>{element.status}</span>
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({
  element,
  openModal,
  editingMode,
  setEditingMode,
  handleUpdateApplication,
  handleEnableEdit,
  handleDisableEdit,
  handleInputChange,
  statusColor,
}) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div class="status">
          {editingMode === element._id ? (
            <select
              value={element.status}
              onChange={(e) =>
                handleInputChange(element._id, "status", e.target.value)
              }
              disabled={editingMode !== element._id ? true : false}
            >
              <option value="Pending">Pending</option>
              <option value="Review">Review</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          ) : (
            <span class={statusColor(element.status)}>{element.status}</span>
          )}
        </div>
        <div class="btn_areaApp">
          <div className="">
            {editingMode === element._id ? (
              <div class="spacebtn">
                <button
                  onClick={() => handleUpdateApplication(element._id)}
                  className="checkbtn1"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => handleDisableEdit()}
                  className="crossbtn1"
                >
                  <RxCross2 />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEnableEdit(element._id)}
                className="editbtn1"
              >
                Update Status
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
