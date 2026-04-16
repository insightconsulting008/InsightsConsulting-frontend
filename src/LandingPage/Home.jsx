import React, { useState, useMemo } from "react";
import { Typewriter } from "react-simple-typewriter";
import {
  FaRegClock,
  FaComments,
  FaUserCheck,
  FaLayerGroup,
  FaSyncAlt,
  FaTasks,
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

  // const logos = [
  //   "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark2.png?updatedAt=1771784349810",
  //   "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark1.png?updatedAt=1771784349777",
  //   "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark2.png?updatedAt=1771784349810",
  //   "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark5.png?updatedAt=1771784349879",
  //   "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark4.png?updatedAt=1771784350077",
  // ];

  const testimonials = [
    {
      name: "Rohit",
      location: "Chennai, India",
      title: "Smooth GST Registration",
      desc: `I was completely confused about GST registration and worried about making mistakes.
Insight Consulting handled everything effortlessly — clear guidance, minimal paperwork, and quick completion.`,
      img: "https://i.pravatar.cc/100?img=12",
    },
    {
      name: "Shruthi",
      location: "Coimbatore, India",
      title: "Professional & Reliable",
      desc: `What impressed me most was their patience and clarity.
Every step of my company registration was explained in simple terms, making the entire process stress-free.`,
      img: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "Aakash",
      location: "Bangalore, India",
      title: "Fast & Hassle-Free Service",
      desc: `Quick responses, zero confusion, and excellent support.
From documentation to filing, Insight Consulting made compliance feel surprisingly easy.`,
      img: "https://i.pravatar.cc/100?img=33",
    },
  ];

  const logos = [
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark4.png",
      name: "Layers",
    },
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark5.png",
      name: "Sisyphus",
    },
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark2.png",
      name: "Circooles",
    },
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark3.png",
      name: "Catalog",
    },
    {
      src: "https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/footer/mark1.png",
      name: "Quotient",
    },
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
          <div className="relative  ">
            <Enquiryform />
          </div>
        </div>
      </section>

      {/* <section className="bg-white mt-14 border-t  border-b border-gray-200 overflow-hidden w-full">

        <div className="w-full px-4 py-3 flex items-center gap-6">

         
          <div className=" items-center gap-2 text-sm hidden md:flex text-gray-600 whitespace-nowrap">
            <span className="hidden md:block">Top Services Offered in</span>
            <span className=" text-blue-600 font-medium">
              Insight Consulting
            </span>
          </div>

         
          <div className="hidden lg:block h-5 border-l border-gray-300"></div>

         
          <div className="relative flex-1 overflow-hidden">

            <div className="flex w-max gap-2 animate-[marquee_30s_linear_infinite]">
              {loopServices.map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md text-gray-700 whitespace-nowrap"
                >
                  {service}
                </span>
              ))}
            </div>

          </div>
        </div>

       
        <style>
          {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
        </style>
      </section> */}

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
                  Human <span className="text-pink-600">Support</span>
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
                <div className="bg-yellow rounded-tl-lg h-full text-white font-semibold px-4 py-3 text-lg">
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
                    <p className="text-3xl font-semibold">10+</p>
                    <p className="text-xs">YOE</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">1k+</p>
                    <p className="text-xs">Clients Served</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">100+</p>
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
                  <div className="w-10 h-10 p-2 rounded-full bg-yellow flex items-center justify-center text-white">
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
                  <div className="w-10 h-10 p-2 rounded-full bg-yellow flex items-center justify-center text-white">
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
                  <div className="w-10 h-10 p-2 rounded-full bg-yellow flex items-center justify-center text-white">
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
                  <div className="w-10 h-10 p-2 rounded-full bg-yellow flex items-center justify-center text-white">
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
                  <span className="absolute top-4 right-4 text-xs bg-yellow-400 text-white px-2 py-1 rounded">
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
            <div className="w-10 h-10 flex items-center   justify-center rounded-full bg-secondary text-primary">
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
      {/* <section className="w-full bg-white py-16 lg:py-24 overflow-hidden">
        <div className="mx-auto">


          <div className="relative w-full overflow-hidden">
            <div className="flex lg:gap-12 gap-5 animate-marquee">
              {[...logos, ...logos, ...logos].map((logo, index) => (
                <div key={index} className="flex items-center lg:gap-3  flex-shrink-0">
                  <img
                    src={logo.src}
                    alt={`${logo.name} mark`}
                    className=" w-6 md:w-11 h-6 md:h-11 object-contain"
                  />
                  <span className="text-[24px] font-bold text-muted tracking-tight">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>
          {`
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      .animate-marquee {
        width: max-content;
        animation: marquee 35s linear infinite;
      }
    `}
        </style>
      </section> */}

      {/* <section className="bg-[#F4EBFF33] py-10 lg:py-16 ">
        <div className="lg:px-12 px-4 container mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-primary text-blue-600">
              <FaUsers />
            </div>
            <h2 className="text-2xl md:text-5xl font-semibold text-gray-900">
              Real Stories
            </h2>
          </div>

          <h3 className="text-lg font-medium text-gray-800">
            People Who Trusted the Panther
          </h3>

          <p className="text-gray-500 max-w-3xl mt-2">
            Authentic experiences from people who trusted LoanWalle when life moved faster than money — and got the support they needed.
          </p>

     
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-sm transition"
              >
            
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    < BiBadgeCheck className="absolute bottom-4 -right-3 w-8 h-8 p-1 bg-primary text-white rounded-full text-lg" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.location}
                    </p>
                  </div>
                </div>

                
                <h4 className="font-semibold mt-5 text-gray-900">
                  “{item.title}”
                </h4>

      
                <p className="text-gray-600 text-sm mt-3 leading-relaxed whitespace-pre-line">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          
          <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 mt-10 gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
          
              <div className="flex -space-x-3">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=3"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=4"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>

              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-900">1,000+</span> Businesses Trust Our Compliance Services
              </p>
            </div>

            <button className="bg-primary  text-white px-6 py-3 rounded-lg font-medium transition" onClick={() => setOpenPopup(true)}>
              Enquire Now ››
            </button>
          </div>
        </div>
      </section> */}

      <section className="bg-secondary py-10 lg:py-20">
        <div className="px-4 lg:px-12 container mx-auto py-5 ">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-yellow text-sm font-semibold mb-2">
              Founder Note
            </p>

            <h2 className="text-2xl md:text-5xl font-semibold text-gray-800">
              Meet Our Founder
            </h2>

            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              A message from our founder on simplifying compliance, empowering
              entrepreneurs, and helping businesses grow with confidence.
            </p>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              {/* Founder Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="founder"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <BiBadgeCheck className="text-blue-500 absolute bottom-0 -right-2 bg-white w-6 h-6 rounded-full text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Pravin Kumar</h4>

                  <p className="text-gray-500 text-sm">
                    Founder, Insight Consulting
                  </p>
                </div>
              </div>

              {/* Tag */}
              <p className="text-primary text-xs font-semibold mb-4 tracking-wide">
                ● OUR VISION & MISSION
              </p>

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

            {/* Right Video Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                {/* Browser Bar */}
                <div className="bg-gray-600 px-4 py-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                </div>

                {/* Video */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
                    alt="video"
                    className="w-full h-[280px] object-cover"
                  />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur rounded-full p-4 shadow-md">
                      <IoPlay className="text-2xl text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="lg:py-15 py-10 bg-secondary">
        <div className="lg:px-12 mx-auto px-4">

          <div className="relative overflow-hidden rounded-2xl border border-secondary bg-white px-8 py-12 text-center">

           
            <div
              className="absolute left-0 top-0 w-96 h-96 opacity-90 bg-no-repeat bg-contain"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Lefft%20Illustration.png')"
              }}
            />

          
            <div
              className="absolute -right-50 bottom-0  w-96 h-96 opacity-90 bg-no-repeat bg-contain"
              style={{
                backgroundImage:
                  "url('https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/Right%20Illustration.png')"
              }}
            />

         
          <div className="relative z-10 max-w-2xl mx-auto">

       
        <p className="text-gray-400 text-xs tracking-widest mb-3">
          BUSINESS COMPLIANCE MADE SIMPLE
        </p>

      
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-snug">
          Start Your Business Journey With <br />
          <span className="underline decoration-gray-300">
            Expert Compliance Support
          </span>
        </h2>

       
        <p className="text-gray-500 mt-4 text-sm">
          From registrations to filings, Insight Consulting helps you navigate
          regulatory requirements with ease, accuracy, and complete peace of mind.
        </p>

      
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button  onClick={() => navigate("/servicehub")} className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition">
            Explore Our Services
          </button>

          <button  onClick={() => navigate("/contact")} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
            Speak With an Expert
          </button>
        </div>

      
        <p className="text-gray-400 text-xs mt-3">
          *Quick, simple & hassle-free process
        </p>

      </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
