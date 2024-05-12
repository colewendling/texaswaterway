'use client';

import React, { useState, useEffect } from 'react';

const Page = () => {
  return (
   

    <div>
      <div className="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
      </div>
      <div>Tailwind Test Page</div>
      <a
        className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
        href="#"
      >
        Texas
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
          Waterway
        </span>
      </a>
    </div>

  );
};

export default Page;
