import React, { useState, useMemo } from "react";
import { Typewriter } from "react-simple-typewriter";
import {
  FaRegClock,
  FaComments,
  FaUserCheck,
  FaLayerGroup,
  FaSyncAlt,
  FaTasks,
  FaComment,
} from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { LuShieldCheck } from "react-icons/lu";
import { FaUserGroup } from "react-icons/fa6";
import { IoFlagSharp } from "react-icons/io5";
import { BiChalkboard } from "react-icons/bi";
import { HiArrowRight } from "react-icons/hi2";

import { FaUserTie, FaSlack, FaDropbox, FaHistory } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaBolt } from "react-icons/fa";
import { FaUsers, FaCheckCircle } from "react-icons/fa";
import { BiBadgeCheck } from "react-icons/bi";

import { motion, AnimatePresence } from "framer-motion";

import { IoPlay } from "react-icons/io5";
import Enquiryform from "./reusable/Enquiryform";
import { useNavigate } from "react-router-dom";
import EnquiryPopup from "./reusable/Popup.jsx";

const steps = [
  {
    no: "01",
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/info-folder%201.png",
    title: "Choose a Service",
    desc: "Browse, enquire, or purchase services from our website",
  },
  {
    no: "02",
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/upload-cloud-folder%201.png",
    title: "Login & Submit Details",
    desc: "Access your dashboard and upload required documents",
  },
  {
    no: "03",
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/upload-cloud-folder%202.png",
    title: "Representative Assigned",
    desc: "A representative manages your service and updates everything.",
  },
  {
    no: "04",
    icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/info-folder%203.png",
    title: "Fast disbursement",
    desc: "Get certificates & ongoing follow-ups for recurring services.",
  },
];

export default function Home() {
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const schemeEndDate = new Date("2026-07-15");

  const services = [
    "GST Registration",
    "GST Filing",
    "MSME",
    "FSSAI",
    "ISO Certification",
    "NGO Registration",
  ];
  const loopServices = [...services, ...services, ...services];
  //   const loopServices = useMemo(
  //   () => [...services, ...services],
  //   [services]
  // );

  const challenges = [
    {
      icon: <FaTasks />,
      title: "Manual Follow-Ups Everywhere",
      desc: "Client reminders, document collection, and status updates were handled manually — leading to delays and missed actions.",
    },
    {
      icon: <FaRegClock />,
      title: "Missed Deadlines & Renewals",
      desc: "Without a structured system, recurring compliances were often forgotten or addressed at the last minute.",
    },
    {
      icon: <FaComments />,
      title: "Scattered Communication",
      desc: "Updates, certificates, and confirmations were shared over calls and chats — with no single source of truth.",
    },
    {
      icon: <FaUserCheck />,
      title: "No Clear Ownership",
      desc: "Clients didn’t know who was handling their service, and teams lacked visibility into task status.",
    },
    // {
    //   icon: <FaLayerGroup />,
    //   title: "Scaling Became Difficult",
    //   desc: "As the number of clients grew, managing services consistently became increasingly complex.",
    // },
    {
      icon: <FaSyncAlt />,
      title: "Recurring Compliance Was Reactive",
      desc: "Most follow-ups happened only after an issue arose, instead of being proactively managed.",
    },
  ];

  const features = [
    // {
    //   icon: 'https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container.png?updatedAt=1771417293358',
    //   title: "Buy Services Online",
    //   desc: "Browse, select, and purchase compliance services directly — with clear pricing, guided onboarding, and no manual follow-ups.",
    // },
    {
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(1).png?updatedAt=1771417293237",
      title: "Dedicated Service Ownership",
      desc: "Each service is assigned to a responsible team member, so clients always know who’s handling their work.",
    },
    {
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(2).png?updatedAt=1771417293299",
      title: "Built-In Follow-Ups & Tracking",
      desc: "Automated reminders and status tracking replace manual follow-ups and last-minute rushes.",
    },
    {
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(3).png?updatedAt=1771417293273",
      title: " Dashboards",
      desc: "Clients track progress transparently, while teams manage workloads with clear visibility.",
    },
    {
      icon: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Text%20Container%20(4).png?updatedAt=1771417293232",
      title: "Recurring Compliance Management",
      desc: "Monthly and periodic compliances are proactively handled — renewals and filings stay on schedule.",
    },
  ];

  const features1 = [
    {
      title: " Dashboard",
      desc: "Track service status, uploads, certificates, and history in one place.",
      icon: <MdDashboard className="text-2xl" />,
      badge: "Popular",
    },
    {
      title: "Dedicated Representative",
      desc: "A single point of contact assigned to handle your service end-to-end.",
      icon: <FaUserTie className="text-2xl" />,
    },
    {
      title: "Centralised Communication",
      desc: "All updates, requests, and confirmations tracked within the system.",
      icon: <FaSlack className="text-2xl" />,
    },
    {
      title: "Secure Document Storage",
      desc: "Upload, access, and download documents securely anytime.",
      icon: <HiOutlineDocumentText className="text-2xl" />,
    },
    {
      title: "Automated Follow-Ups",
      desc: "Renewals and recurring compliances tracked and followed up proactively.",
      icon: <FaDropbox className="text-2xl" />,
    },
    {
      title: "Complete Service History",
      desc: "View past services, filings, and certificates whenever needed.",
      icon: <FaHistory className="text-2xl" />,
    },
  ];

  const stats = [
    { value: "10+", label: "Compliance Experience" },
    { value: "1,000+", label: "Businesses Served" },
    { value: "5,000+", label: "Services Delivered" },
    { value: "100%", label: "Compliance Track" },
  ];

  return (
    <>
      <section
        className="relative bg-cover  bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/a887b935f178ca98fda0052257faa5c0f46c4a37.jpg')",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-white/90"></div>
        <img
          src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Vector%20157.png"
          alt=""
          className="absolute -bottom-10  md:right-16 lg:right-0   lg:w-[50%]  h-160 md:h-180 lg:h-140   "
        />

        <div className="relative lg:px-12 px-4 container  mx-auto  pt-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className=" ">
            <p className="text-sm text-gray-600 mb-4">
              Trusted by{" "}
              <span className="text-primary font-semibold">1,000+</span>{" "}
              Business Owners ❤️
            </p>

            <h1 className="text-2xl md:text-5xl font-semibold text-gray-800 leading-tight">
              Compliance Made Simple for <br />
              <span className="text-green-600 font-bold">
                <Typewriter
                  words={[
                    "GST Registration",
                    "GST Filing",
                    "Company Incorporation",
                    "Compliance Support",
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </h1>

            <p className="mt-4  text-gray-600 max-w-lg">
              From registrations to ongoing filings, we help businesses stay
              compliant across multiple regulatory requirements.
            </p>

            <button
              onClick={() => navigate("/contact")}
              className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-medium shadow"
            >
              Get started
            </button>
          </div>

          {/* RIGHT FORM */}
          <div className="relative">
            <Enquiryform />
          </div>
        </div>
      </section>

      {today <= schemeEndDate && (
        <div className="w-full mt-12">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="7"
            className="w-full 
      bg-gradient-to-r from-[#F4B43A] via-[#F09A2A] to-[#C9510A] 
      text-white py-5 
      text-base lg:text-xl 
      tracking-wide"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 500, // base weight
            }}
          >
            🚨{" "}
            <span style={{ fontWeight: 700 }}>
              Companies Compliance Facilitation Scheme, 2026
            </span>{" "}
            — Scheme Period:{" "}
            <span style={{ fontWeight: 800 }}>15 April – 15 July 2026</span> •
            Complete filings and stay compliant without penalties.
          </marquee>
        </div>
      )}
      <section className="mt-10 py-10 lg:py-20 bg-secondary text-gray-900">
        <div className="container mx-auto">
          <div className="lg:px-12 px-4 mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-6 mb-12">
              <div>
                <h2 className="text-2xl md:text-5xl font-semibold mb-4 text-gray-900">
                  Built From Real Compliance Challenges
                </h2>

                <p className="text-gray-600 max-w-2xl">
                  Working closely with businesses, we noticed that compliance
                  failures rarely happen due to lack of intent but due to poor
                  tracking, manual follow-ups, and fragmented processes.
                </p>
              </div>
            </div>

            <EnquiryPopup
              open={openPopup}
              onClose={() => setOpenPopup(false)}
            />

            {/* Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {challenges.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-6
            bg-white
            border border-gray-200
            shadow-sm
            ${index >= challenges.length - 2 ? "lg:col-span-3" : "lg:col-span-2"}`}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-lg 
              bg-blue-50 text-blue-600 text-xl mb-4"
                  >
                    {item.icon}
                  </div>

                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-secondary  py-10 lg:py-20">
        <div className="container mx-auto">
          <div className="lg:px-12 px-4 mx-auto ">
            {/* Top Row */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              {/* Left Content */}
              <div>
                <p className="text-yellow-600 text-sm font-semibold mb-3">
                  HOW WE SOLVE IT
                </p>

                <h2 className="text-2xl md:text-5xl font-semibold text-gray-800 mb-4">
                  A Smarter Way To Manage Compliance
                </h2>

                {/* <p className="text-gray-600 max-w-xl">
                We built a structured system that simplifies compliance management,
                improves visibility, and ensures nothing is missed — for both
                clients and our internal teams.
              </p> */}
              </div>

              {/* Right Image */}
              <div className="flex justify-center  lg:justify-end">
                <img
                  src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Image.png"
                  alt="illustration"
                  className="w-full max-w-md"
                />
              </div>
            </div>

            {/* Features Grid */}
            <div className="flex flex-col lg:flex-row  w-full h-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2  gap-x-12 gap-y-10 relative pt-5  md:pt-10">
                <div className="border border-dashed hidden lg:block border-gray-300 absolute top-[55%] w-full "></div>
                {features.map((item, index) => (
                  <div key={index} className="flex gap-4 ">
                    <img
                      src={item.icon}
                      className="w-10 h-9 flex items-center justify-center "
                    />

                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600  leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}

                {/* CTA block */}
              </div>
              <div className="lg:col-span-1  border border-gray-300 p-3 rounded-md border-dashed flex flex-col mt-5 lg:mt-0  items-center justify-center">
                <p className="  text-center  italic mb-4">
                  Compliance services, available when you need them without{" "}
                  <span className="font-semibold">Manual Coordination</span>
                </p>

                <button
                  className="bg-primary  text-white px-6 py-3 rounded-lg font-medium w-max"
                  onClick={() => setOpenPopup(true)}
                >
                  Talk to Our Team &gt;&gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-yellow/5   py-10 lg:py-20">
        <div className="mx-auto container">
          <div className=" px-4 lg:px-12 mx-auto ">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-yellow text-sm font-semibold mb-2">
                WHY INSIGHT CONSULTING
              </p>

              <h2 className="text-2xl md:text-5xl font-semibold text-gray-800 mb-3">
                Where Compliance Feels Simple
              </h2>

              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                We don’t just deliver compliance services — we change how
                businesses experience compliance, communication, and follow-ups.
              </p>

              {/* <button
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium w-fit"
                onClick={() => navigate('/resource')}
              >
                Learn From Our Blog &gt;&gt;
              </button> */}
            </div>

            {/* Cards Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Card */}
              <div className="relative bg-secondary rounded-2xl md:p-6 p-3 min-h-[340px] overflow-hidden">
                <h3 className="text-xl  font-semibold text-green-600 ">
                  Hassle Free
                </h3>
                <h4 className="font-semibold text-xl text-gray-800 mb-4 ">
                  Process
                </h4>
                <p className="text-gray-600 text-sm max-w-xs">
                  Simple steps, clear communication, and minimal back-and-forth
                  throughout the service.
                </p>

                {/* Dummy Image */}
                <img
                  src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/handsome-man-making-no-gesture%201.png"
                  alt="dummy"
                  className="absolute bottom-0 left-1/2 md:h-72 h-46 -translate-x-1/2"
                />
              </div>

              {/* Middle Column */}
              <div className="flex flex-col gap-6">
                {/* Card 2 */}
                <div className="relative bg-secondary rounded-2xl md:p-6 p-3 min-h-[200px] overflow-hidden">
                  <h3 className="text-xl font-semibold text-gray-800">
                    No <span className="text-blue-600">Chasing</span>
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 max-w-xs">
                    We proactively manage{" "}
                    <br className="hidden lg:block xl:hidden" />
                    follow-ups and renewals,{" "}
                    <br className="hidden lg:block  xl:hidden" /> so clients
                    don’t have to <br className="hidden lg:block  xl:hidden" />{" "}
                    remind us.
                  </p>

                  <img
                    src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Adobe%20Express%20-%20file%20(2)%201.png"
                    alt="dummy"
                    className="absolute bottom-0 md:h-40 h-28 right-0"
                  />
                </div>

                {/* Card 3 */}
                <div className="relative bg-yellow/10 rounded-2xl p-3 lg:p-6 min-h-[200px] overflow-hidden">
                  <h3 className="text-xl font-semibold text-yellow-600">
                    Clear Ownership
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 max-w-xs">
                    Every step and update is{" "}
                    <br className="md:block hidden  xl:hidden" /> communicated
                    clearly no <br className="md:block hidden  xl:hidden" />{" "}
                    confusion, <br className="md:block hidden  xl:hidden" />
                    no surprises.
                  </p>

                  <img
                    src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Untitled%20(3)%201.png"
                    alt="dummy"
                    className="absolute bottom-0 md:h-40 h-28 right-0"
                  />
                </div>
              </div>

              {/* Right Card */}
              <div className="relative bg-secondary rounded-2xl p-3 lg:p-6 min-h-[340px] overflow-hidden">
                <h3 className="text-xl font-semibold text-gray-800">
                  Human <span className="text-green-600">Support</span>
                </h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs">
                  Real people who understand your business handle your
                  compliance.
                </p>

                <img
                  src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/portrait-man-working-as-telemarketer%201.png"
                  alt="dummy"
                  className="absolute bottom-0 h-46 md:h-72 right-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary  py-10 md:py-16">
        <div className="container  lg:px-12 px-4 mx-auto ">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <p className="text-yellow-600 text-sm font-semibold mb-2">
                HOW IT WORKS
              </p>

              <h2 className="text-2xl md:text-5xl font-semibold text-gray-800 mb-3">
                Simple Steps. Zero Stress.
              </h2>

              <p className="text-gray-600 max-w-xl">
                We built the process anyone can use it — no complexity, no
                confusion, just a clear path to getting the compliance you need.
              </p>
            </div>

            <button
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium w-fit"
              onClick={() => setOpenPopup(true)}
            >
              Enquire Now &gt;&gt;
            </button>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white rounded-xl shadow-sm"
              >
                {/* Number */}
                <div className="bg-primary rounded-tl-lg h-full text-white font-semibold px-4 py-3 text-lg">
                  {step.no}
                </div>

                {/* Content */}
                <div className="relative px-3 py-6">
                  <img
                    className="h-14 absolute -top-7 right-0 text-gray-700 mb-2"
                    src={step.icon}
                    alt=""
                  />

                  {/* ✅ Larger title */}
                  <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">
                    {step.title}
                  </h3>

                  {/* ✅ Larger description */}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" lg:py-16 py-10 ">
        <div className="container lg:px-12 px-4 mx-auto ">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full border border-indigo-300 flex items-center justify-center text-indigo-500">
                  <FaLightbulb />
                </div>
                <h2 className="text-2xl md:text-5xl font-semibold text-gray-800">
                  COMPLIANCE & CONTINUITY
                </h2>
              </div>

              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Vector%20(1).png?updatedAt=1771488262931"
                alt="underline"
                className="w-40 ml-12"
              />
            </div>

            <div className="max-w-md">
              <h3 className="font-semibold  text-gray-800 mb-2">
                Compliance You Don’t Have to Chase
              </h3>
              <p className="text-gray-600 text-sm">
                We don’t stop at one-time services. Our system is built to
                manage recurring compliances, renewals, and follow-ups
                proactively.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-secondary rounded-2xl p-3 lg:p-6 grid lg:grid-cols-3 gap-6 items-center">
            {/* Left Image */}
            <div className="relative h-[380px] rounded-xl overflow-hidden">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Sub%20Container.png"
                alt="team"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 lg:p-6 text-white">
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-3xl font-semibold">30+</p>
                    <p className="text-xs">YOE</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">400+</p>
                    <p className="text-xs">Clients Served</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">10k+</p>
                    <p className="text-xs">Filings</p>
                  </div>
                </div>

                <button
                  className="bg-primary pl-2 pr-4 py-2 flex items-center gap-2 rounded-full w-max"
                  onClick={() => navigate("/about")}
                >
                  <HiArrowRight
                    size={10}
                    className="w-8 h-8 p-2 text-black bg-white rounded-full"
                  />{" "}
                  Explore Our Story
                </button>
              </div>
            </div>

            {/* RIGHT FEATURES (CENTERED) */}
            <div className="lg:col-span-2 h-full mb-4  rounded-3xl flex items-center">
              <div className="grid lg:grid-cols-2 w-full">
                {/* Item 1 */}
                <div className="flex gap-4   lg:p-6 md:border-b lg:border-r border-gray-200">
                  <div className="w-10 h-10 p-2 rounded-full bg-primary flex items-center justify-center text-white">
                    <LuShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Proactive Follow-Ups
                    </h4>
                    <p className="text-gray-600">
                      We track deadlines and follow up before issues arise.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex gap-4 lg:p-6 mb-4 lg:border-b border-gray-200">
                  <div className="w-10 h-10 p-2 rounded-full bg-primary flex items-center justify-center text-white">
                    <BiChalkboard size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Recurring Compliance Handling
                    </h4>
                    <p className="text-gray-600">
                      Monthly and periodic compliances managed automatically.
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex gap-4 lg:p-6 mb-4 border-r border-gray-200">
                  <div className="w-10 h-10 p-2 rounded-full bg-primary flex items-center justify-center text-white">
                    <FaUserGroup size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Centralised Records
                    </h4>
                    <p className="text-gray-600">
                      All filings, certificates, and updates stored securely.
                    </p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex gap-4 mb-4 lg:p-6">
                  <div className="w-10 h-10 p-2 rounded-full bg-primary flex items-center justify-center text-white">
                    <IoFlagSharp size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      Dedicated Support
                    </h4>
                    <p className="text-gray-600">
                      Same team, consistent support, no repeated explanations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 ">
        <div className="lg:px-12 px-4 container  mx-auto">
          {/* Top Label */}
          <p className="text-primary font-semibold text-sm tracking-wider">
            ONE PLATFORM
          </p>

          {/* Heading */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-2 gap-6">
            <div>
              <h2 className="text-2xl md:text-5xl font-semibold text-gray-900">
                Everything You Need, Connected in One Place
              </h2>
              <p className="text-gray-500 mt-2 max-w-xl">
                From communication to documents and follow-ups all managed
                within a single system.
              </p>
            </div>

            <div className="flex lg:justify-end lg:w-80">
              <button
                className="bg-primary text-white lg:px-6 px-4 py-3 rounded-md font-medium transition w-fit"
                onClick={() => setOpenPopup(true)}
              >
                Enquire Now →
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {features1.map((item, i) => (
              <div
                key={i}
                className="relative bg-white rounded-xl p-6 border border-dashed border-gray-200 hover:shadow-md transition"
              >
                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-4 right-4 text-xs bg-primary text-white px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}

                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 mb-4">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className=" y-10 lg:py-16 ">
        <div className="lg:px-12 px-4 container  mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 flex items-center text-2xl  justify-center rounded-full bg-secondary text-primary">
              <FaBolt />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-5xl font-semibold text-gray-900">
            Compliance Backed by Experience
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Helping businesses manage compliance reliably through a structured
            system and dedicated support.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {stats.map((item, i) => (
              <div
                key={i}
                className="border-r last:border-none border-gray-200 px-4"
              >
                <p className="text-3xl md:text-4xl font-semibold text-primary">
                  {item.value}
                </p>
                <p className="text-gray-600 text-sm mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Sub text */}
          <p className="text-gray-500 text-sm mt-10">
            Join 4,000+ companies already growing
          </p>

          {/* Logos */}
        </div>
      </section>

      <section className="bg-secondary py-10 lg:py-20">
        <div className="px-4 lg:px-12 container mx-auto py-5">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 text-2xl flex items-center   justify-center rounded-full bg-secondary text-primary">
              <FaComment />
            </div>
          </div>
          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-5xl font-semibold text-gray-800">
              Message from our Leader
            </h2>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              {/* Title */}
              <h3 className="text-xl md:text-3xl font-semibold text-gray-800 leading-snug mb-4">
                Simplifying Compliance. Empowering Businesses.
              </h3>

              {/* Description */}
              <p className="text-gray-500 mb-6 max-w-lg">
                Insight Consulting was built with a simple goal — to remove the
                complexity of registrations, filings, and regulatory
                requirements so entrepreneurs can focus on growing their
                businesses with clarity and confidence.
              </p>

              {/* Button */}
              <button
                onClick={() => navigate("/contact")}
                className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Contact us
              </button>
            </div>

            {/* Right Image Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Image */}
                <div className="relative">
                  <img
                    src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/istockphoto-1365436662-612x612.jpg"
                    alt="Founder at work"
                    className="w-full h-[340px] object-cover object-top"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Bottom Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-semibold text-base">
                      From compliance to strategy
                    </p>
                    <p className="text-white/70 text-sm">
                      strengthen your finance function end-to-end
                    </p>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="px-5 py-4 flex items-center gap-3 bg-gray-50 border-t border-gray-100">
                  <div className="w-4 h-4 rounded-full bg-green-400" />
                  <p className="text-gray-800 font-bold text-xl">
                    where CLARITY meets GROWTH.
                  </p>
                </div>
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -top-4 -right-4 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md">
                30+ Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
