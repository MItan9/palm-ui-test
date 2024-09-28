import axios from "axios";

export default function Logout() {
  async function onClick() {
    const response = await axios.post(
      "/bff/logout",
      {},
      {
        headers: {
          "X-POST-LOGOUT-SUCCESS-URI": process.env.NEXT_PUBLIC_BASE_URI,
        },
      }
    );
    window.location.href = response.headers["location"];
  }

  return (
    <button
      type="submit"
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      style={{ float: "right", margin: "10px" }} // Keep it floating on the right
    >
      Logout
    </button>
  );
}
