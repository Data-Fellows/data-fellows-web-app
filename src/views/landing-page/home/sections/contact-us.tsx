import { FiMail } from "react-icons/fi";

export default function ContactUs() {
  return (
    <>
      <div className="h-14 bg-background"></div>
      <div className="min-h-screen py-4">
        <div>
          <div>
            <div className="flex flex-col bg-background text-foreground p-4 md:mx-auto md:space-x-8 md:bg-primary/10 md:p-16 lg:flex-row">
              <div className="mb-8 w-full lg:mb-0 lg:w-1/3">
                <h1 className="mb-8 text-4xl font-bold">Contact Us</h1>
                <div className="flex flex-row space-x-8">
                  <div className="mb-6 flex items-center gap-2">
                    <FiMail className="w-6 h-6 text-primary dark:text-primary-foreground" />
                    <div>
                      <a
                        href="mailto:info@datafellowsai.com"
                        className="text-foreground dark:text-foreground"
                      >
                        info@datafellowsai.com
                      </a>
                    </div>
                  </div>
                </div>
                <button className="w-1/2 max-sm:w-3/5 rounded-md px-8 py-3 font-semibold bg-primary text-primary-foreground flex items-center gap-2">
                  <FiMail className="w-5 h-5" />
                  Get in Touch
                </button>
              </div>
              <div className="w-full rounded-2xl border border-primary/50 bg-gradient-to-b from-muted-foreground/5 to-primary/20 p-2 shadow-sm backdrop-blur-xl md:w-full md:p-8 lg:w-2/3">
                <div className="md:mx-6">
                  <form>
                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="input-icon-group">
                        <label
                          htmlFor="name"
                          className="mb-2 block font-medium text-foreground dark:text-foreground"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          placeholder="John"
                          className="w-full rounded-md border p-4 pl-10 bg-background text-foreground dark:bg-card dark:text-foreground"
                        />
                      </div>
                      <div className="input-icon-group">
                        <label
                          htmlFor="surname"
                          className="mb-2 block font-medium text-foreground dark:text-foreground"
                        >
                          Surname
                        </label>
                        <input
                          id="surname"
                          placeholder="Doe"
                          className="w-full rounded-md border p-4 pl-10 bg-background text-foreground dark:bg-card dark:text-foreground"
                        />
                      </div>
                    </div>
                    <div className="input-icon-group mb-6">
                      <label
                        htmlFor="email"
                        className="mb-2 block font-medium text-foreground dark:text-foreground"
                      >
                        Mail
                      </label>
                      <input
                        id="email"
                        placeholder="johndoe@mail.net"
                        className="w-full rounded-md border p-4 pl-10 bg-background text-foreground dark:bg-card dark:text-foreground"
                      />
                    </div>
                    <div className="input-icon-group mb-6">
                      <label
                        htmlFor="address"
                        className="mb-2 block font-medium text-foreground dark:text-foreground"
                      >
                        Address
                      </label>
                      <input
                        id="address"
                        placeholder="Capitol, WA"
                        className="w-full rounded-md border p-4 pl-10 bg-background text-foreground dark:bg-card dark:text-foreground"
                      />
                    </div>
                    <div className="input-icon-group mb-8">
                      <label
                        htmlFor="description"
                        className="mb-2 block font-medium text-foreground dark:text-foreground"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        placeholder="How can we help you?"
                        rows={5}
                        className="w-full resize-none rounded-md border p-4 pl-10 bg-background text-foreground dark:bg-card dark:text-foreground"
                      />
                    </div>
                    <button
                      type="button"
                      className="h-14 w-full py-3 font-semibold bg-primary text-primary-foreground rounded-md flex items-center justify-center gap-2"
                    >
                      <FiMail className="w-5 h-5" />
                      Get in Touch
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background text-foreground">
            <div
              className="mx-4 mt-16 max-w-full rounded-3xl text-white md:mx-auto md:max-w-[80vw] "
              style={{
                backgroundImage:
                  "linear-gradient(to right, #2C6E8F, #1B3A4B), url('/svgs/landing-page/baseline.svg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
              }}
            >
              <div className="flex flex-col items-center justify-between p-6 md:flex-row md:p-12">
                <div className="mb-8 max-w-2xl md:mb-0 md:mr-8">
                  <h2 className="mb-4 text-xl font-bold leading-tight md:text-4xl md:leading-[3.2rem] text-white">
                    Unlock the power of AI Data Analytics Solutions today
                  </h2>
                  <p className="text-base leading-relaxed md:text-lg text-white/90">
                    Explore our cutting-edge services tailored for SMBs,
                    connecting businesses with top professionals, and ensuring
                    quality through rigorous vetting processes.
                  </p>
                </div>
                <button className="h-auto w-[250px] whitespace-nowrap px-8 py-3 text-lg font-medium md:py-4 bg-primary text-primary-foreground rounded-md flex items-center gap-2">
                  <FiMail className="w-5 h-5" />
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
