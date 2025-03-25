"use client";

import React from "react";

const SecurityInfo: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Security Information</h2>
      <p className="text-gray-700">
        To ensure a secure connection, always use URLs that start with &quot;https://&quot; when accessing websites or services.
      </p>
      <p className="mt-4 text-gray-700">
        Regularly update your software to the latest version to protect against security risks.
      </p>
      <p className="mt-4 text-gray-700">
        Use strong passwords and enable two-factor authentication whenever possible.
      </p>
    </div>
  );
};

export default SecurityInfo;