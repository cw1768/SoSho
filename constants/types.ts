import { Session } from "@supabase/supabase-js";

export interface Board {
    id: string;
    name: string;
    itemCount: number;
    items: Product[];
}

export interface BoardListProps {
    boards: Board[];
    onBoardPress: (boardId: string) => void;
}

export interface ProfileHeaderProps {
    size: number
    url: string | null
    followerCount: number;
    followingCount: number;
    friendCount: number;
    userName: string; 
    fullName: string;
    onUpload: (filePath: string) => void
    session: Session
}

export interface Product {
    id: string
    price: number
    link: string
    title: string
    imageUrl?: string[];
    description: string
}

export interface ProductListProps {
    onProductPress: (productId: string) => void;
    session: Session;
}

export interface actionUpdate {
    id: string;
    type: string;
    friendName: string;
    friendAvatar: string;
    itemName: string;
    itemImage: string;
    timestamp: string;
}

export interface FriendUpdatesSliderProps {
    updates: actionUpdate[];
}

export interface browsingHistData {
    id: string;
    product: Product;
    timestamp: string;
}

export interface browsingHistDataProps {
    history: browsingHistData[];
}



type CommentType = { account: string, comment: string, avatar: string}

export interface Post {
    id: string;
    avatar: string;
    user: string;
    action: string;
    content: string;
    timestamp: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    bookmarkCount: number;
    comments: CommentType[];
    product: Product
    board: Board
    isEndList: boolean;
}
