import { easeOut, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

function DesktopFooter() {
  return (
    <motion.footer
      className="bg-gradient-to-br from-[#1B3A4B] to-[#2C6E8F] text-white"
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-7xl px-8 py-16">
        <motion.div
          className="flex justify-between gap-12"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={fadeInUp}>
            <Image
              src="/svgs/landing-page/Logo.svg"
              alt="Data Fellows Logo"
              width={150}
              height={60}
              className="h-16 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm font-light">
              Affordable Data Analytics Solutions Powered by AI.
            </p>
          </motion.div>

          <motion.div className="flex gap-20" variants={fadeInUp}>
            <div>
              <h3 className="mb-4 text-xl font-semibold">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/sign-up"
                    className="hover:text-yellow-300 transition"
                  >
                    Data Professionals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="hover:text-yellow-300 transition"
                  >
                    Business Partners
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-yellow-300 transition"
                  >
                    Help & Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-yellow-300 transition"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col items-end space-y-4"
            variants={fadeInUp}
          >
            <div className="flex space-x-4 text-xl">
              <Link href="#" aria-label="Twitter">
                <FaTwitter className="hover:text-blue-400 transition" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <FaLinkedin className="hover:text-blue-600 transition" />
              </Link>
              <Link href="#" aria-label="GitHub">
                <FaGithub className="hover:text-gray-300 transition" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="border-t border-white/20 bg-gradient-to-br from-[#1B3A4B]/80 to-[#2C6E8F]/80 px-8 py-6"
        variants={fadeInUp}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
          <span>
            © {new Date().getFullYear()} Data Fellows. All Rights Reserved.
          </span>
          <div className="flex space-x-6">
            <Link
              href="/privacy-policy"
              className="hover:text-yellow-300 transition"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-yellow-300 transition">
              Terms of Use
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
}

function MobileFooter() {
  return (
    <motion.footer
      className="bg-gradient-to-br from-[#1B3A4B] to-[#2C6E8F] text-white"
      initial="hidden"
      animate="visible"
    >
      <div className="px-6 py-10 space-y-8">
        <motion.div variants={fadeInUp}>
          <Image
            src="/svgs/data-fellow.svg"
            alt="Data Fellows Logo"
            width={120}
            height={40}
            className="h-12 w-auto"
          />
          <p className="mt-4 text-base font-light">
            Affordable Data Analytics Solutions Powered by AI.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h3 className="mb-4 text-lg font-semibold">Product</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/sign-up" className="hover:text-teal-300 transition">
                Data Professionals
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-teal-300 transition">
                Business Partners
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h3 className="mb-4 text-lg font-semibold">Support</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/contact" className="hover:text-teal-300 transition">
                Help & Support
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-teal-300 transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div className="flex space-x-6 text-xl" variants={fadeInUp}>
          <Link href="#" aria-label="Twitter">
            <FaTwitter className="hover:text-blue-400 transition" />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <FaLinkedin className="hover:text-blue-600 transition" />
          </Link>
          <Link href="#" aria-label="GitHub">
            <FaGithub className="hover:text-gray-300 transition" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="border-t border-white/20 px-6 py-6"
        variants={fadeInUp}
      >
        <div className="flex flex-col items-center space-y-4 text-sm">
          <span>© {new Date().getFullYear()} Data Fellows.</span>
          <div className="flex space-x-4">
            <Link
              href="/privacy-policy"
              className="hover:text-teal-300 transition"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-teal-300 transition">
              Terms of Use
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
}

export const Footer = () => (
  <>
    <div className="hidden md:block">
      <DesktopFooter />
    </div>
    <div className="block md:hidden">
      <MobileFooter />
    </div>
  </>
);
