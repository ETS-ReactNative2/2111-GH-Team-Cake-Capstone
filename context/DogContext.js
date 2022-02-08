import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase";
import { useFirebaseAuth } from "./FirebaseAuthContext";

const DogContext = createContext(undefined);

const DogProvider = ({ children }) => {
  const [dogUser, setDogUser] = useState(null);
  const value = dogUser;
  const currUser = useFirebaseAuth();

  useEffect(async () => {
    if(currUser && currUser.uid){
      const q = query(collection(db, "users"), (where("uid", "==", currUser.uid)));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setDogUser(doc.data());
      })
    }
  }, [currUser]);

  console.log(dogUser)

  return (
    <DogContext.Provider value={value}>
      {children}
    </DogContext.Provider>
  );
}

function useDog() {
  const context = useContext(DogContext);
  if (context === undefined) {
    throw new Error(
      "useDog must be used within a DogProvider"
    );
  }
  return context;
}

export { DogProvider, useDog };
