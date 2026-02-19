import React, { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import { dummyContacts } from '../data/dummyContacts';
import './ChatsPage.css';

const ChatsPage = () => {
    const [contacts, setContacts] = useState(dummyContacts);
    const [selectedContact, setSelectedContact] = useState(dummyContacts[0]);

    const handleSelectContact = (contact) => {
        // Merge any updated messages from state back into selection
        const fresh = contacts.find((c) => c.id === contact.id);
        setSelectedContact(fresh || contact);
    };

    // When a reply comes in, update contact's last message in the sidebar list
    const handleUpdateContact = (contactId, lastMessage, timestamp) => {
        setContacts((prev) =>
            prev.map((c) =>
                c.id === contactId
                    ? { ...c, lastMessage, timestamp }
                    : c
            )
        );
    };

    // Keep selectedContact synced when contacts list updates
    const currentContact = contacts.find((c) => c.id === selectedContact?.id) || selectedContact;

    return (
        <div className={`chats-page ${currentContact ? 'has-selected' : ''}`}>
            <ChatSidebar
                contacts={contacts}
                selectedId={currentContact?.id}
                onSelect={handleSelectContact}
            />

            {currentContact ? (
                <ChatWindow
                    key={currentContact.id}
                    contact={currentContact}
                    onUpdateContact={handleUpdateContact}
                    onBack={() => setSelectedContact(null)}
                />
            ) : (
                <div className="chats-empty">
                    <div className="chats-empty-icon">💬</div>
                    <h3>Select a chat to start messaging</h3>
                    <p>Choose a contact from the left panel</p>
                </div>
            )}
        </div>
    );
};

export default ChatsPage;
