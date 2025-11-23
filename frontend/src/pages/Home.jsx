import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-tertiary/20 to-primary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Bloom-well
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Your Personal Health and Wellness Tracker
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Build healthy habits by tracking your meals, water intake, sleep, and mood. 
            Take control of your wellbeing journey today.
          </p>
          {!user ? (
            <div className="flex gap-4 justify-center flex-wrap mb-10">
              <Link
                to="/signup"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/10 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link to="/dashboard" className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-2">Dashboard</h3>
            <p className="text-gray-600">See today’s meals, water, sleep, and mood at a glance with clear visuals and quick navigation.</p>
          </Link>
          <Link to="/wellness" className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-2">Wellness Tracking</h3>
            <p className="text-gray-600">Log hydration, sleep hours, and mood daily to build routines and spot trends over time.</p>
          </Link>
          <Link to="/nutritions" className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-primary mb-2">Nutrients Tracking</h3>
            <p className="text-gray-600">Record meals with type and calories to maintain balanced nutrition throughout your day.</p>
          </Link>
        </div>
          )}
        </div>

        
        <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-2xl mb-4">“The greatest wealth is health.”</p>
            <p className="text-gray-600">Make small, consistent steps each day.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-2xl mb-4">“Take care of your body. It’s the only place you have to live.”</p>
            <p className="text-gray-600">Hydration, sleep, and nutrition fuel your energy.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-2xl mb-4">“A healthy outside starts from the inside.”</p>
            <p className="text-gray-600">Track, reflect, and improve with awareness.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
