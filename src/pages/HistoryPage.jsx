import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trash2, History, Search } from 'lucide-react';
import ba from '../assets/ab.jpg'; 
import Footer from '../components/Footer'; 
import Image from '../assets/4.png'; 

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // ✅ Track item to delete

  // Get user email
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      } else {
        console.error('User not authenticated', error);
        setUserEmail('guest');
      }
    };
    getUser();
  }, []);

  // Fetch classification history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!userEmail) return;

      try {
        const res = await fetch(
          `http://localhost:8000/history/?user_email=${encodeURIComponent(userEmail)}`
        );
        const result = await res.json();
        setHistory(result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userEmail]);

  const deleteItem = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8000/delete/?prediction_id=${id}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting prediction:', err);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.style?.toLowerCase().includes(filter.toLowerCase()) ||
    item.description?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDeleteClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete(id); // ✅ Open confirmation modal
  };

  const confirmDeleteItem = () => {
    if (confirmDelete) {
      deleteItem(confirmDelete);
      setConfirmDelete(null); // close modal after delete
    }
  };

  return (
    <div
      className="flex-grow relative w-full px-4 md:px-8 py-6 md:py-10 text-black dark:text-white"
      style={{
        backgroundImage: `url(${ba})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0 hidden dark:block bg-cover bg-center "
        style={{ backgroundImage: `url(${Image})` }}
      ></div>

      <div className="relative z-10 space-y-8 max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold whitespace-nowrap dark:text-white">
            🎨 Classification History
          </h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Search by style or description..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/80 border border-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none rounded-full py-2 pl-10 pr-4 text-sm text-black placeholder-gray-600"
            />
          </div>
        </div>

        {/* Card Grid */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <Link
                key={item.id}
                to={`/history/${item.id}`}
                state={{ item: item }}
                className="block relative group transition-transform hover:scale-[1.02]"
              >
                <div className="bg-white/90 text-black rounded-2xl shadow-xl backdrop-blur-md overflow-hidden h-full">
                  <img
                    src={item.image_url}
                    alt={item.style || 'Artwork'}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{item.style}</h3>
                      <span className="text-xs font-semibold text-yellow-700">
                        {((item.confidence || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm opacity-80 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-xs opacity-60 pt-2">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : 'No timestamp'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(e, item.id)}
                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <History className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold">No History Yet</h3>
            <p className="opacity-80 mt-2">
              {filter
                ? `No matching results for "${filter}".`
                : 'Start classifying images to see your history here.'}
            </p>
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96 text-center">
            <div className="text-red-600 mb-3">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Delete this file?</h2>
            <p className="text-sm opacity-80 mb-6">
              This file will be permanently deleted and cannot be recovered.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteItem}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer at Bottom */}
      <Footer />
    </div>
  );
};

export default HistoryPage;
