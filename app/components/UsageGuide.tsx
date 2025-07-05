"use client";

import React from "react";

const UsageGuide: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Usage Guide
      </h2>
      <p className="text-gray-700">
        To use this service, click on the provided website link. You can easily
        check the necessary information on the website.
      </p>
      <p className="mt-4 text-gray-700">
        To get real-time information, use the refresh button on the website.
      </p>
      <p className="mt-4 text-gray-700">
        If you need more detailed information, please contact the support team.
      </p>
    </div>
  );
};

export default UsageGuide;
