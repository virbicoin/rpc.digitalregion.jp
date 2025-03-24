"use client";

import React from "react";

const SecurityInfo: React.FC = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold">Security Information</h2>
      <p className="mt-2">
        Ensure your connection is secure by using HTTPS and WSS protocols.
      </p>
      <p className="mt-2">
        Regularly update your client software to the latest version to protect against vulnerabilities.
      </p>
    </div>
  );
};

export default SecurityInfo;