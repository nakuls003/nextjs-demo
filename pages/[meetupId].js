import React from "react";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../components/meetups/MeetupDetail";
import Head from "next/head";

const MeetupDetailPage = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

async function getCollectionFromDb() {
  const connection = await MongoClient.connect(
    "mongodb+srv://nakul:nakulmongo@cluster0.favuphr.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = connection.db();
  return db.collection("meetups");
}

export async function getStaticPaths() {
  const collection = await getCollectionFromDb();
  const meetupIds = await collection.find({}, { _id: 1 }).toArray();

  return {
    fallback: false,
    paths: meetupIds.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const meetupsCollection = await getCollectionFromDb();
  const meetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  return {
    props: {
      meetupData: {
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        description: meetup.description,
        image: meetup.image,
      },
    },
  };
}

export default MeetupDetailPage;
