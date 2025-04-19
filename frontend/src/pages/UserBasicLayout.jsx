import React from 'react';
import UserNavbar from '../components/userNavbar';

const DefaultLayout = ({ children, currentUser, handleLogout, cartItemCount }) => {
    return (
        <>
            <UserNavbar
                currentUser={currentUser}
                handleLogout={handleLogout}
                cartItemCount={cartItemCount}
            />
            <main className="container mt-4">
                {children}
            </main>
        </>
    );
};

export default DefaultLayout;
