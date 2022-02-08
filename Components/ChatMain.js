import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	ImageBackground,
	ScrollView,
	SafeAreaView,
	FlatList,
} from "react-native";
import { Avatar, Text, Divider, Paragraph, Title } from "react-native-paper";
import db from "../firebase";
import {
	collection,
	getDocs,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";

// THINGS THAT NEED TO BE COMPLETED:
// 1. Add "last message" if possible
// 2. If user doesn't have any matches, then display string in chat that says they have no matches/messages (ternary op in return statement)
// 3. STYLING!!!!

export default function ChatMain({ navigation }) {
	const [matches, setMatches] = useState([]);
	const [users, setUsers] = useState([]);
	// const [lastMessage, setLastMessage] = useState("");
	const currentUser = useFirebaseAuth();

	useEffect(() => {
		const getUsers = async () => {
			const usersColRef = collection(db, "users");
			const usersData = await getDocs(usersColRef);

			setUsers(
				usersData.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}))
			);
		};

		getUsers();
	}, []);
	// console.log("USERS LOOK HERE", users);

	// useEffect below has an implicit return to serve as cleanup
	useEffect(
		() =>
			onSnapshot(
				query(collection(db, "matches"), where("dog_a", "==", currentUser.uid)),
				(snapshot) => {
					const matchesDogA = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					onSnapshot(
						query(
							collection(db, "matches"),
							where("dog_b", "==", currentUser.uid)
						),
						(snapshot) => {
							const matchesDogB = snapshot.docs.map((doc) => ({
								id: doc.id,
								...doc.data(),
							}));
							const combinedMatches = matchesDogA.concat(matchesDogB);
							setMatches(combinedMatches);
						}
					);
				}
			),
		[currentUser]
	);
	// console.log("MATCHES LOOK HERE", matches);

	const matchesList = matches.map((match) => {
		return match.dog_a === currentUser.uid
			? { id: match.id, matchedDog: match.dog_b }
			: { id: match.id, matchedDog: match.dog_a };
	});
	// console.log("MATCHES LIST LOOK HERE", matchesList);

	return (
		<View style={styles.container}>
			<ImageBackground
				source={require("../assets/capstone_bg.gif")}
				style={styles.bgImage}
			>
				<View style={styles.chats}>
					{users.map((user) =>
						matchesList.map((match) =>
							match.matchedDog === user.uid ? (
								<View key={user.id}>
									<Text
										mode="contained"
										onPress={() =>
											navigation.navigate("ChatMessage", { match })
										}
									>
										<Avatar.Image
											style={styles.avatarImg}
											source={require("../assets/placeholder.jpg")}
										/>
										<Title>{user.name}</Title>
									</Text>
									<Paragraph
										style={{
											marginLeft: 70,
										}}
									>
										Say hi!
									</Paragraph>
									<Divider />
								</View>
							) : null
						)
					)}
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignSelf: "flex-start",
	},
	bgImage: {
		flex: 1,
		width: "100%",
		height: "100%",
		resizeMode: "stretch",
		padding: 0,
		margin: 0,
	},
	chats: {
		flex: 1,
		marginTop: 30,
		marginLeft: 20,
		marginBottom: 70,
		justifyContent: "space-around",
	},
});
