export default function Donors() {
  return (
    <div className="p-10 bg-[#0D1117] min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-[#F8F9FA]">Find Donors</h1>
      <div className="form-control">
        <input
          type="text"
          placeholder="Search by location or blood type..."
          className="input input-bordered w-full max-w-md bg-[#0D1117] text-[#F8F9FA] border-[#C1272D]"
        />
        <button className="btn bg-[#C1272D] text-[#F8F9FA] hover:bg-[#8B1E3F] transition duration-300 mt-2">
          Search
        </button>
      </div>
      {/* Placeholder for search results */}
      <div className="mt-10 text-[#F8F9FA]">
        <p>No donors found yet!</p>
      </div>
    </div>
  );
}
