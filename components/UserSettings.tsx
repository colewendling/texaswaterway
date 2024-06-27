'use client';

import React, { useState } from 'react';
import { Settings, LogOut, UserPen } from 'lucide-react';
import Modal from '@/components/Modal';
import UserForm from './UserForm';
import { signOut } from 'next-auth/react';

const UserSettings = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = () => setDropdownVisible((prev) => !prev);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="user-settings">
      <div className="user-settings-button" onClick={toggleDropdown}>
        <Settings
          className={
            dropdownVisible
              ? 'user-settings-button-active'
              : 'user-settings-button-inactive'
          }
        />
      </div>
      {dropdownVisible && (
        <div className="user-settings-dropdown">
          <button
            onClick={() => {
              setDropdownVisible(false);
              setIsModalOpen(true);
            }}
            className="user-settings-dropdown-option"
          >
            <UserPen className="user-settings-dropdown-option-icon" />
            <span className="user-settings-dropdown-option-text">Account</span>
          </button>
          <button
            onClick={() => {
              setDropdownVisible(false);
              signOut({ callbackUrl: '/' });
            }}
            className="user-settings-dropdown-option"
          >
            <LogOut className="user-settings-dropdown-option-icon" />
            <span className="user-settings-dropdown-option-text">Logout</span>
          </button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <UserForm onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default UserSettings;
