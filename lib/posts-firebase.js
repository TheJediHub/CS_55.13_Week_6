import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function publicPostId(doc) {
    const data = doc.data();
    if (data.id !== undefined && data.id !== null && data.id !== '') {
        return data.id.toString();
    }
    return doc.id;
}

function serializePost(doc) {
    const data = doc.data();
    return {
        ...data,
        id: publicPostId(doc),
    };
}

function matchesRequestedId(doc, id) {
    const requested = id.toString();
    if (doc.id === requested) {
        return true;
    }
    const fieldId = doc.data().id;
    return fieldId !== undefined && fieldId !== null && fieldId.toString() === requested;
}

export async function getSortedPostsData() {
    const myCollectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(myCollectionRef);
    const jsonObj = querySnapshot.docs.map(serializePost);

    jsonObj.sort(function (a, b) {
        return a.title.localeCompare(b.title);
    });

    return jsonObj.map(item => {
        return {
            id: item.id.toString(),
            title: item.title,
            date: item.date
        }
    });
}

export async function getAllPostIds() {
    const myCollectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(myCollectionRef);

    return querySnapshot.docs.map(doc => {
        return {
            params: {
                id: publicPostId(doc)
            }
        }
    });
}

export async function getPostData(id) {
    const myCollectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(myCollectionRef);
    const match = querySnapshot.docs.find(doc => matchesRequestedId(doc, id));

    if (!match) {
        return {
            id: id,
            title: 'Not found',
            date: '',
            contentHtml: 'Not found'
        }
    }

    return serializePost(match);
}
