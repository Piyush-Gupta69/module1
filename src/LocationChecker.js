import React, { useState, useEffect } from "react";
import Success from "./Success";
import { useCurrentUser } from "./hooks/useCurrentUser";
import {Link} from "react-router-dom";


const distanceThreshold = 17; // Threshold distance in meters

const LocationChecker = () => {
  
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [distance, setDistance] = useState(null);
  // const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    console.log("Selected class:", event.target.value);
  };

  useEffect(() => {
    // Get the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        // setCounter((counter) => counter + 1);
        setLoading(false);

        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
      },
      (error) => console.log(error),
      { enableHighAccuracy: true }
    );
  },[selectedClass]);

  useEffect(() => {

    const classLocations = {
      "class-a": {
        latitude: 26.8422,
        longitude: 75.5643,
      },
      "class-b": {
        latitude: 26.8421,
        longitude: 75.5642,
      },
      "class-c": {
        latitude: 26.8436,
        longitude: 75.5660,
      },
    };
 
    

    function toRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }

    const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
      console.log("calculate called");
      const a = 6378137; // semi-major axis of the WGS84 ellipsoid in meters
      const f = 1 / 298.257223563; // flattening of the WGS84 ellipsoid
      const b = (1 - f) * a; // semi-minor axis of the WGS84 ellipsoid in meters
      if (lat1 === lat2 && lon1 === lon2) return 0;
      const phi1 = toRadians(lat1);
      const phi2 = toRadians(lat2);
      const lambda1 = toRadians(lon1);
      const lambda2 = toRadians(lon2);

      const L = lambda2 - lambda1;
      let previousLambda,
        lambda = L;
      let sinSigma, cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM, C;
      let i = 0;
      do {
        previousLambda = lambda;
        const sinLambda = Math.sin(lambda);
        const cosLambda = Math.cos(lambda);

        const u1 = Math.atan((1 - f) * Math.tan(phi1));
        const u2 = Math.atan((1 - f) * Math.tan(phi2));
        const sinU1 = Math.sin(u1);
        const cosU1 = Math.cos(u1);
        const sinU2 = Math.sin(u2);
        const cosU2 = Math.cos(u2);

        sinSigma = Math.sqrt(
          (cosU2 * sinLambda) ** 2 +
            (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) ** 2
        );
        cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        sigma = Math.atan2(sinSigma, cosSigma);

        sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
        cosSqAlpha = 1 - sinAlpha ** 2;
        cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;

        C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambda =
          L +
          (1 - C) *
            f *
            sinAlpha *
            (sigma +
              C *
                sinSigma *
                (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
      } while (Math.abs(lambda - previousLambda) > 1e-12 && ++i < 100);

      const uSq = (cosSqAlpha * (a ** 2 - b ** 2)) / b ** 2;
      const A =
        1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
      const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
      const deltaSigma =
        B *
        sinSigma *
        (cos2SigmaM +
          (B / 4) *
            (cosSigma * (-1 + 2 * cos2SigmaM ** 2) -
              (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma ** 2)));

      const s = b * A * (sigma - deltaSigma);

      // Return the distance in meters
      return s;
    };

    // Calculate the distance from the fixed latitude and longitude
    if (latitude && longitude && classLocations[selectedClass]) {
      console.log('hereeeeeeee')
      const { latitude: classLatitude, longitude: classLongitude } =
        classLocations[selectedClass];
      const distanceInMeters = calculateDistanceInMeters(
        latitude,
        longitude,
        classLatitude,
        classLongitude
      );
      setDistance(distanceInMeters);
      console.log(distanceInMeters);
    }
  }, [latitude, longitude, selectedClass]);

 

  const displayResult = () => {
    console.log("displayResult called");
    if (!selectedClass) {
      return <p>Please select a class.</p>;
    }
    if (loading || !distance) {
      return <p>Getting your location...</p>;
    }
    if (distance <= distanceThreshold) {
      return <Success text="PRESENT!" />;
    }
    if (distance > distanceThreshold) return <Success text="ABSENT!" />;
  };

  const {isLoading,isAuthorized,username}=useCurrentUser();
  if(isLoading)
  return null;
  if(!isAuthorized)
  return <h1>You must signin at <Link to="/">Login</Link> !!!</h1>

  return (
    <>
    <h1>{username}</h1>
    <div>
      <label htmlFor="class-select">Select a class:</label>
      <select id="class-select" value={selectedClass} onChange={handleClassChange}>
        <option value="">Select a class</option>
        <option value="class-a">Class A</option>
        <option value="class-b">Class B</option>
        <option value="class-c">Class C</option>
      </select>
      {displayResult()}
    </div>
    </>
  );
};

export default LocationChecker;
