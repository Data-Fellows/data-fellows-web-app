import Image from "next/image";
import {
  FiActivity,
  FiAward,
  FiBookmark,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiGlobe,
  FiLayers,
  FiMail,
  FiMapPin,
  FiPhone,
  FiStar,
  FiUser,
} from "react-icons/fi";

const dummyUser = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  userType: "user",
  photoUrl: "/avatars/avatar-1.png",
  bio: "Data scientist with a passion for solving real-world problems using machine learning and analytics.",
  profileCompletion: 85,
  verified: true,
  active: true,
  dateOfBirth: "1995-06-15",
  phone: "+1 555-123-4567",
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  country: "USA",
  skills: [
    { name: "Python" },
    { name: "SQL" },
    { name: "Machine Learning" },
    { name: "Data Visualization" },
  ],
  categories: [{ name: "Healthcare" }, { name: "Finance" }],
  specialities: [{ name: "NLP" }, { name: "Time Series" }],
  workExperience: [
    {
      title: "Data Scientist",
      company: "Tech Solutions",
      location: "San Francisco, CA",
      startDate: "2021-01-01",
      endDate: "2023-06-01",
      description:
        "Worked on predictive analytics and ML models for healthcare clients.",
    },
    {
      title: "Data Analyst",
      company: "FinCorp",
      location: "Remote",
      startDate: "2019-05-01",
      endDate: "2020-12-31",
      description: "Built dashboards and automated reports for financial data.",
    },
  ],
  educationHistory: [
    {
      school: "Stanford University",
      degree: "MSc",
      fieldOfStudy: "Data Science",
      startDate: "2017-09-01",
      endDate: "2019-06-01",
      description: "Graduated with honors.",
    },
    {
      school: "UCLA",
      degree: "BSc",
      fieldOfStudy: "Statistics",
      startDate: "2013-09-01",
      endDate: "2017-06-01",
      description: "",
    },
  ],
  bookmarkedJobs: [
    { _id: "1", title: "Data Analyst at HealthAI" },
    { _id: "2", title: "ML Engineer at FinTechX" },
  ],
  categoriesAndSpecialitiesAdded: true,
  skillsAdded: true,
  workExperienceAdded: true,
  educationHistoryAdded: true,
  bioAdded: true,
};

export default function UserDashboardFull() {
  const user = dummyUser;

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="col-span-1 bg-card rounded-xl shadow-lg p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <Image
              src={user.photoUrl}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full border-4 border-primary"
            />
            {user.verified && (
              <span className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1">
                <FiCheckCircle className="text-white" />
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiUser /> {user.firstName} {user.lastName}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <FiMail /> {user.email}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <FiPhone /> {user.phone}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <FiMapPin /> {user.city}, {user.state}, {user.country}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <FiCalendar /> {user.dateOfBirth}
          </div>
          <div className="w-full mt-4">
            <div className="flex items-center gap-2 mb-1">
              <FiActivity /> Profile Completion
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full"
                style={{ width: `${user.profileCompletion}%` }}
              ></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {user.profileCompletion}%
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-2 flex flex-col gap-8">
          {/* Bio & Skills */}
          <div className="bg-card rounded-xl shadow p-6 mb-2">
            <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
              <FiAward /> Bio
            </div>
            <p className="mb-4">{user.bio}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  <FiStar className="text-xs" /> {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Categories & Specialities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                <FiLayers /> Categories
              </div>
              <div className="flex flex-wrap gap-2">
                {user.categories.map((cat) => (
                  <span
                    key={cat.name}
                    className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                <FiGlobe /> Specialities
              </div>
              <div className="flex flex-wrap gap-2">
                {user.specialities.map((sp) => (
                  <span
                    key={sp.name}
                    className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {sp.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Work Experience & Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                <FiBriefcase /> Work Experience
              </div>
              <ul className="space-y-3">
                {user.workExperience.map((exp, idx) => (
                  <li key={idx} className="border-l-4 border-primary pl-3">
                    <div className="font-semibold">{exp.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {exp.company} &middot; {exp.location}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                    {exp.description && (
                      <div className="text-sm mt-1">{exp.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                <FiBookOpen /> Education
              </div>
              <ul className="space-y-3">
                {user.educationHistory.map((edu, idx) => (
                  <li key={idx} className="border-l-4 border-primary pl-3">
                    <div className="font-semibold">
                      {edu.degree} in {edu.fieldOfStudy}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {edu.school}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </div>
                    {edu.description && (
                      <div className="text-sm mt-1">{edu.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bookmarked Jobs */}
          <div className="bg-card rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
              <FiBookmark /> Bookmarked Jobs
            </div>
            <ul className="flex flex-wrap gap-3">
              {user.bookmarkedJobs.map((job: any) => (
                <li
                  key={job._id}
                  className="bg-muted px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {job.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
