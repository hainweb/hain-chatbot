"use client";
import React, { useState } from 'react';
import { X, Globe,  MessageSquare, User, Bell, Shield, Database, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function SettingsModal({ isOpen, onClose, isDarkMode, onToggleTheme }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState('general');
  const [showFollowUpSuggestions, setShowFollowUpSuggestions] = useState(true);
  const [language, setLanguage] = useState('auto-detect');
  const [spokenLanguage, setSpokenLanguage] = useState('auto-detect');

  if (!isOpen) return null;

  const menuItems = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'personalization', label: 'Personalization', icon: MessageSquare },
    { id: 'connected-apps', label: 'Connected apps', icon: Globe },
    { id: 'data-controls', label: 'Data controls', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account', icon: Key },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Theme
        </label>
        <select 
          value={isDarkMode ? 'dark' : 'light'} 
          onChange={(e) => {
            const isDark = e.target.value === 'dark';
            if (isDark !== isDarkMode) {
              onToggleTheme();
            }
          }}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {/* <option value="light">Light</option> */}
          <option value="dark">Dark</option>
          {/* <option value="system">System</option> */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Language
        </label>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto-detect">Auto-detect</option>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Spoken language
        </label>
        <select 
          value={spokenLanguage}
          onChange={(e) => setSpokenLanguage(e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto-detect">Auto-detect</option>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          For best results, select the language you mainly speak. If it&apos;s not listed, it may still be supported via auto-detection.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Show follow up suggestions in chats
          </label>
        </div>
        <button
          onClick={() => setShowFollowUpSuggestions(!showFollowUpSuggestions)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            showFollowUpSuggestions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showFollowUpSuggestions ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">Notification settings will be available soon.</p>
          </div>
        );
      case 'personalization':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">Personalization options will be available soon.</p>
          </div>
        );
      case 'connected-apps':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">Connected apps management will be available soon.</p>
          </div>
        );
      case 'data-controls':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">Data control options will be available soon.</p>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">Security settings will be available soon.</p>
          </div>
        );
      case 'account':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">Account settings will be available soon.</p>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Settings text and close button */}
          <div className="absolute top-4 left-6 right-4 z-20 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex w-full pt-16">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}