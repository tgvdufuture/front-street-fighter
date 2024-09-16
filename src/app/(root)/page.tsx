"use client";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Characters from "../components/Characters";
import Image from "next/image";

const features = [
  "Combat 1v1 Epic",
  "Graphismes époustouflants",
  "Mode multijoueur en ligne",
  "Personnalisation des personnages",
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/street.jpg"
            alt="Game background"
            layout="fill"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold mb-4"
          >
            Street Fighter
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8"
          >
            Expérience de combat ultime avec des graphismes époustouflants
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300"
          >
            Joue maintenant
          </motion.button>
        </div>
      </section>

      {/* Character Showcase */}
      <Characters />

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Fonctionnalités du jeu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-bold mb-2">{feature}</h3>
                <p className="text-gray-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt au combat ?</h2>
          <p className="text-xl mb-8">
            Rejoins des millions de joueurs à travers le monde
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-red-600 font-bold py-3 px-6 rounded-full text-lg transition duration-300"
          >
            Joue maintenant
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
