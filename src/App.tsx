import './App.css';
import { useState, useEffect } from 'react';

interface User {
  profileImage: string;
  firstName: string;
  lastName: string;
  email: string;
  nat: string;
}

function App() {
  const [userData, setUserData] = useState<User[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [natInput, setNatInput] = useState<string>('');

  const fetchUserData = async () => {
    const response = await fetch(`https://randomuser.me/api/?results=50`);
    const data = await response.json();
    return data.results;
  };

  useEffect(() => {
    fetchUserData().then((result) => {
      const formattedData = result.map((user: any) => ({
        profileImage: user.picture.large,
        firstName: user.name.first,
        lastName: user.name.last,
        email: user.email,
        nat: user.nat,
      }));
      setUserData(formattedData);
    });
  }, []);

  const filteredUsers = userData.filter((user) => {
    const lowerFirstName = user.firstName.toLowerCase();
    const lowerLastName = user.lastName.toLowerCase();
    const matchesName =
      lowerFirstName.includes(userInput.toLowerCase()) ||
      lowerLastName.includes(userInput.toLowerCase());
    const matchesNationality = natInput === 'All' || user.nat === natInput;

    return matchesName && matchesNationality;
  });

  const uniqueNat: string[] = [];
  const natSet = new Set();

  userData.map((user) => {
    if (!natSet.has(user.nat)) {
      natSet.add(user.nat);
      uniqueNat.push(user.nat);
    }
  });

  const userTotal = userData.length;
  const displayedUserTotal = filteredUsers.length;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 gap-5 text-black">
      <h1 className="text-3xl font-bold text-green-400">User Directory</h1>
      <p className="text-xl text-green-400"> Total Users: {userTotal}</p>
      <p className="text-xl text-green-400">
        Displayed Users: {displayedUserTotal}
      </p>
      <div className="flex gap-2 text-black">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setUserInput(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <select
          className="p-2 px-[10px] border border-gray-300 rounded-md"
          name="nat"
          id="nat"
          onChange={(e) => setNatInput(e.target.value)}
        >
          <option value="All">All</option>
          {uniqueNat.map((nat) => (
            <option key={nat}>{nat}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-5">
        {filteredUsers &&
          filteredUsers.map((user) => (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg w-[300px] h-[300px]">
              <img
                className="rounded-full"
                width="200px"
                height="200px"
                src={user.profileImage}
              />
              <h2 className="text-xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p>{user.email}</p>
              <p>Nationality: {user.nat}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
