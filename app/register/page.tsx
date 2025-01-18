export default function Register() {
  return (
    <div className="hero min-h-screen bg-[#0D1117]">
      <div className="hero-content flex-col">
        <h1 className="text-3xl font-bold text-[#F8F9FA]">Register</h1>
        <div className="form-control w-full max-w-sm">
          <label className="label">
            <span className="label-text text-[#F8F9FA]">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full bg-[#2A2D34] text-[#F8F9FA] border-[#8B1E3F]"
          />
          <label className="label">
            <span className="label-text text-[#F8F9FA]">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full bg-[#2A2D34] text-[#F8F9FA] border-[#8B1E3F]"
          />
          <label className="label">
            <span className="label-text text-[#F8F9FA]">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full bg-[#2A2D34] text-[#F8F9FA] border-[#8B1E3F]"
          />
          <button className="btn bg-[#C1272D] text-[#F8F9FA] mt-4">Register</button>
        </div>
      </div>
    </div>
  );
}
