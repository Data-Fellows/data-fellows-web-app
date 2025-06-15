import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";

export default function ContactUs() {
  return (
    <>
      <div className="h-14 bg-background"></div>
      <div className="min-h-screen py-4 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="flex flex-col items-center justify-center px-2 py-8 pt-20">
          <motion.div
            className="flex w-full md:w-[80%] flex-col rounded-3xl bg-background/80 shadow-xl ring-1 ring-primary/10 backdrop-blur-lg md:flex-row"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="flex flex-col justify-between bg-gradient-to-b from-primary/90 to-primary/60 p-8 text-primary-foreground max-sm:rounded-b-none  md:rounded-tl-3xl md:rounded-bl-3xl max-sm:rounded-xl  md:w-[36%]"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div>
                <h1 className="mb-6 text-4xl font-bold">Contact Us</h1>
                <div className="mb-8 flex items-center gap-3">
                  <FiMail className="w-6 h-6" />
                  <a
                    href="mailto:info@datafellowsai.com"
                    className="underline hover:text-white"
                  >
                    info@datafellowsai.com
                  </a>
                </div>
                <p className="mb-8 text-base text-primary-foreground/90">
                  We’d love to hear from you! Fill out the form and our team
                  will get back to you soon.
                </p>
              </div>
              <motion.a
                href="mailto:info@datafellowsai.com"
                className="mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-white/10 px-6 py-3 font-semibold text-white shadow transition hover:bg-white/20"
                whileHover={{ scale: 1.04 }}
              >
                <FiMail className="w-5 h-5" />
                Get in Touch
              </motion.a>
            </motion.div>

            <motion.div
              className="relative w-full  md:rounded-tr-3xl md:rounded-br-3xl max-sm:rounded-xl md:w-[64%] overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <img
                src="/images/data-community-hero.jpg"
                alt="Contact background"
                className="absolute inset-0 h-full w-full object-cover z-0"
              />
              <div className="absolute inset-0 bg-background/90 z-10"></div>
              <div className="relative z-20 p-8">
                <form>
                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block font-medium text-foreground"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        placeholder="John"
                        className="w-full rounded-md border border-primary/20 bg-background p-4 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="surname"
                        className="mb-2 block font-medium text-foreground"
                      >
                        Surname
                      </label>
                      <input
                        id="surname"
                        placeholder="Doe"
                        className="w-full rounded-md border border-primary/20 bg-background p-4 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="mb-2 block font-medium text-foreground"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      placeholder="johndoe@mail.net"
                      className="w-full rounded-md border border-primary/20 bg-background p-4 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="address"
                      className="mb-2 block font-medium text-foreground"
                    >
                      Address
                    </label>
                    <input
                      id="address"
                      placeholder="Capitol, WA"
                      className="w-full rounded-md border border-primary/20 bg-background p-4 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="description"
                      className="mb-2 block font-medium text-foreground"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="How can we help you?"
                      rows={5}
                      className="w-full resize-none rounded-md border border-primary/20 bg-background p-4 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </div>
                  <motion.button
                    type="button"
                    className="h-14 w-full rounded-md bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 text-lg shadow transition hover:bg-primary/90"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FiMail className="w-5 h-5" />
                    Get in Touch
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <section className="relative mx-4 my-16 max-w-full rounded-3xl md:mx-auto md:max-w-[80vw] overflow-hidden">
          <img
            src="/images/data-community-hero.jpg"
            alt="AI Data Analytics"
            className="absolute inset-0 h-full w-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-primary/80 z-10"></div>
          <div className="relative z-20 flex flex-col items-center justify-between p-6 md:flex-row md:p-12 text-white">
            <motion.div
              className="mb-8 max-w-2xl md:mb-0 md:mr-8"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-xl font-bold leading-tight md:text-4xl md:leading-[3.2rem]">
                Unlock the power of AI Data Analytics Solutions today
              </h2>
              <p className="text-base leading-relaxed md:text-lg text-white/90">
                Explore our cutting-edge services tailored for SMBs, connecting
                businesses with top professionals, and ensuring quality through
                rigorous vetting processes.
              </p>
            </motion.div>
            <motion.a
              href="mailto:info@datafellowsai.com"
              className="h-auto w-[200px] whitespace-nowrap px-8 py-3 text-lg font-medium md:py-4 bg-white/10 text-white rounded-md flex items-center gap-2 shadow transition hover:bg-white/20"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FiMail className="w-5 h-5" />
              Get started
            </motion.a>
          </div>
        </section>
      </div>
    </>
  );
}
