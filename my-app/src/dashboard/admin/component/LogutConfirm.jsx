function LogoutConfirm({handleConfirmLogout,setShowLogoutConfirm}) {
    return ( 
    <>
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 text-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold font-sans text-gray-800">
              Do you want to logout?
            </h3>
            <p className="text-gray-500 text-sm mt-2 font-sans">
              You will be redirected back to the login screen.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)} // Close the popup
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl cursor-pointer font-sans font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout} // Execute logout and redirect
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl cursor-pointer font-sans font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

    
    </>  
    );
}

export default LogoutConfirm;