const Footer = () => {
  return (
    <footer className="footer bg-[#0D1117] text-[#F8F9FA] p-10">
      <nav>
        <h6 className="footer-title text-[#C1272D]">Services</h6>
        <a className="link link-hover text-[#F8F9FA]">Branding</a>
        <a className="link link-hover text-[#F8F9FA]">Design</a>
        <a className="link link-hover text-[#F8F9FA]">Marketing</a>
        <a className="link link-hover text-[#F8F9FA]">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title text-[#C1272D]">Company</h6>
        <a className="link link-hover text-[#F8F9FA]">About us</a>
        <a className="link link-hover text-[#F8F9FA]">Contact</a>
        <a className="link link-hover text-[#F8F9FA]">Jobs</a>
        <a className="link link-hover text-[#F8F9FA]">Press kit</a>
      </nav>
      <nav>
        <h6 className="footer-title text-[#C1272D]">Legal</h6>
        <a className="link link-hover text-[#F8F9FA]">Terms of use</a>
        <a className="link link-hover text-[#F8F9FA]">Privacy policy</a>
        <a className="link link-hover text-[#F8F9FA]">Cookie policy</a>
      </nav>
      <form>
        <h6 className="footer-title text-[#C1272D]">Newsletter</h6>
        <fieldset className="form-control w-80">
          <label className="label">
            <span className="label-text text-[#F8F9FA]">
              Enter your email address
            </span>
          </label>
          <div className="join">
            <input
              type="text"
              placeholder="username@site.com"
              className="input input-bordered join-item bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
            />
            <button className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300 join-item">
              Subscribe
            </button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
};

export default Footer;
