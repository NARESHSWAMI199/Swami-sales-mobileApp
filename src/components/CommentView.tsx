import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, Alert } from "react-native"
import { Avatar, Button, Input } from "react-native-elements"
import { TouchableOpacity } from "react-native"
import CommentRepliesView from "./CommentReplies"
import { bodyColor, commentUrl, defaultAvtar, getUser, themeColor, userImageUrl } from "../utils/utils"
import { Icon } from "@rneui/themed"
import CommentInputBox from "./CommentInputBox"
import { connect } from "react-redux"
import { ApplicationState } from "../redux"
import { logError, logInfo } from '../utils/logger' // Import logger
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { log } from "react-native-reanimated"

const itemsPerPage = 10
const CommentView = (props: any) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { itemId } = props
    const [comments, setComments] = useState<any>([])
    const [parent, setParent] = useState<any>({})
    const [showRepliesModel, setShowRepliesModal] = useState(false)
    const [newReplyComment, setNewReplyComment] = useState(false)
    const commentRef = useRef(null);
    const [messagePrefix, setMessagePrefix] = useState('')
    const [selectedComment, setSelectedComment] = useState<any>(null);

    const [token, setToken] = useState<string>()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>()
    const [totalElements, setTotalElements] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<any>()

    // setting user
    useEffect(() => {
        let updatedUser = async()=> {
           setUser(await props.user)
        }
        updatedUser()
    },[props.user]) 

    // Effect to get token from props
    useEffect(() => {
        const getData = async () => {
            setToken(await props.token)
            setIsAuthenticated(!!(await props.token) ? true : false)
            logInfo(`Token and authentication state set`)
        }
        getData()
    }, [props.token])



    // adding new comment in pervious comments
    useEffect(()=>{
        logInfo(`Adding new comment`)
        if(!!props.newComment)
        setComments([props.newComment,...comments])
    },[props.newComment])


    // Effect to fetch comments
    useEffect(() => {
        logInfo(`Fetching comments for itemId: ${itemId}`)
        setLoading(true);
        axios.post(commentUrl + "all", {
            itemId: itemId,
            pageNumber: currentPage,
            pageSize: itemsPerPage
        })
            .then(res => {
                let response = res.data;
                setComments(prevComments => [...response.content,...prevComments])
                setTotalElements(response.totalElements)
                logInfo(`Comments fetched successfully`)
                setLoading(false);
            })
            .catch(err => {
                logError(`Error fetching comments: ${err.message}`)
                setLoading(false);
            })
    }, [currentPage])  // props.isCommentUpdate is a prop that is passed when i enter a new comment

    // Function to show replies
    const showReplies = (parent: any) => {
        setParent(parent)
        setShowRepliesModal(true)
        setMessagePrefix('')
        logInfo(`Showing replies for parent comment id: ${parent.id}`)
    }

    // Function to close modal
    const closeModel = () => {
        setShowRepliesModal(false)
        setMessagePrefix('')
        logInfo(`Closing replies modal`)
    }

    // Function to updating comment replies
    const updateNewReplyComment = (newReply : any) => {
        setNewReplyComment(newReply)
        logInfo(`Updating comment replies`)
    }

    // Function to handle reply action
    const handleReply = (parent: any) => {
        if (!isAuthenticated) {
            navigation.navigate('login' as never);
            return;
        }
        setParent(parent)
        setShowRepliesModal(true)
        setMessagePrefix('')
        setTimeout(() => {
            commentRef.current?.blur();
            commentRef.current?.focus();
        }, 100)
        logInfo(`Handling reply for parent comment id: ${parent.id}`)
    };

    // Function to handle likes
    const handleLikes = async (commentId: number) => {
        if (!isAuthenticated) {
            navigation.navigate('login' as never);
            return;
        }
        await axios.get(commentUrl + "like/" + commentId)
            .then(res => {
                let response = res.data;
                setComments(previous => previous.filter((comment: any) => {
                    if (comment.id == commentId) {
                        comment.likes += (!!response.likes) ? response.likes : 0;
                        comment.dislikes += (!!response.dislikes) ? response.dislikes : 0;
                        comment.isLiked = response.isLiked;
                        comment.isDisliked = response.isDisliked;
                    }
                    return comment;
                }))
                logInfo(`Likes updated for comment id: ${commentId}`)
            })
            .catch(err => {
                logError(`Error updating likes: ${err.message}`)
            })
    }

    // Function to handle dislikes
    const handleDislike = async (commentId: number) => {
        if (!isAuthenticated) {
            navigation.navigate('login' as never);
            return;
        }
        await axios.get(commentUrl + "dislike/" + commentId)
            .then(res => {
                let response = res.data;
                setComments(previous => previous.filter((comment: any) => {
                    if (comment.id == commentId) {
                        comment.likes += (!!response.likes) ? response.likes : 0;
                        comment.dislikes += (!!response.dislikes) ? response.dislikes : 0;
                        comment.isLiked = response.isLiked;
                        comment.isDisliked = response.isDisliked;
                    }
                    return comment;
                }))
                logInfo(`Dislikes updated for comment id: ${commentId}`)
            })
            .catch(err => {
                logError(`Error updating dislikes: ${err.message}`)
            })
    }

    // Function to handle child reply
    const handleChildReply = (reply: any) => {
        if (!isAuthenticated) {
            navigation.navigate('login' as never);
            return;
        }
        if (!!reply) {
            commentRef.current?.blur();
            setTimeout(() => {
                setMessagePrefix("@" + reply.user.username)
                commentRef.current?.focus();
            }, 100)
            logInfo(`Handling child reply for comment id: ${reply.id}`)
        }
    }

    // Function to discard text
    const discardText = () => {
        setMessagePrefix('')
        logInfo(`Discarding text`)
    }

    // Function to update main comment
    const updateMainComment = (comment: any) => {
        setComments(previous => previous.filter((_comment: any) => {
            if (comment.id == _comment.id) {
                _comment.likes = comment.likes,
                _comment.dislikes = comment.dislikes
                _comment.isLiked = comment.isLiked,
                _comment.isDisliked = comment.isDisliked,
                _comment.repliesCount = comment.repliesCount
            }
            return _comment
        }))
        logInfo(`Main comment updated for comment id: ${comment.id}`)
    }

    // Function to handle scroll event
    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        if (isCloseToBottom && !loading && comments.length < totalElements) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }

    // Function to delete comment
    const deleteComment = (commentSlug: string) => {
        Alert.alert(
            "Delete Comment",
            "Are you sure you want to delete this comment?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        axios.post(`${commentUrl}delete/${commentSlug}`)
                            .then(() => {
                                setComments(comments.filter((comment: any) => comment.slug !== commentSlug));
                                logInfo(`Comment deleted: ${commentSlug}`);
                            })
                            .catch(err => {
                                logError(`Error deleting comment: ${err.message}`);
                            });
                    },
                    style: "destructive"
                }
            ]
        );
    }

    // Function to show options (reply and delete)
    const showOptions = (comment: any) => {
        setSelectedComment(comment);
    }

    // Function to hide options
    const hideOptions = () => {
        setSelectedComment(null);
    }

    // Effect to handle navigation focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // ANything you want to do when the screen is focused
        });

        const unsubscribeBlur = navigation.addListener('blur', () => {
            // Close replies modal when navigating away
            setShowRepliesModal(false);
        });

        return () => {
            unsubscribe();
            unsubscribeBlur();
        };
    }, [navigation]);

    // Render component
    return (<View>
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
            {comments.length > 0 && <Text style={style.commentsLabel}>Comments : </Text>}
            {comments.map((comment: any, index: number) => {
                return (
                    <View key={index} style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <View style={style.messageBody}>
                            <View>
                                <Avatar size={25}
                                    rounded
                                    source={{
                                        uri: !!comment.user?.avtar ? userImageUrl + comment.user.slug + "/" + comment.user.avtar : defaultAvtar
                                    }}
                                    title={!comment.user?.avtar ? `${comment.user?.username?.charAt(0)}${comment.user?.surname?.charAt(0)}` : undefined}
                                />
                            </View>
                            <View style={style.messageView}>
                                <View>
                                    <Text style={{
                                        fontSize: 10,
                                    }}>
                                        {"@" + comment?.user?.username?.toLowerCase()}
                                    </Text>
                                    <Text style={style.message}>
                                        {comment.message}
                                    </Text>
                                    <View style={style.replyActions}>
                                    <View style={{ display: 'flex', flexDirection: 'row' ,width: '70%'}}>
                                        <View style={style.likesOrDislikeBody}>
                                            <Pressable onPress={() => {
                                                handleLikes(comment.id)
                                            }}>

                                                <Icon
                                                    style={{ ...style.iconStyle, marginRight: 5 }}
                                                    name='thumbs-up'
                                                    type='font-awesome'
                                                    color={!comment.isLiked ? '#565757' : themeColor}
                                                    size={20}

                                                />
                                            </Pressable>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'gray' }}>
                                                {!!comment.likes && comment.likes}
                                            </Text>
                                            {comment.isLiked && (
                                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: themeColor, marginLeft: 5 }}>
                                                    Liked
                                                </Text>
                                            )}
                                        </View>
                                        <View style={style.likesOrDislikeBody}>
                                            <Pressable onPress={() => handleDislike(comment.id)}>
                                                <Icon
                                                    style={{ ...style.iconStyle, marginRight: 5 }}
                                                    name='thumbs-down'
                                                    type='font-awesome'
                                                    color={!comment.isDisliked ? '#565757' : themeColor}
                                                    size={20}
                                                />
                                            </Pressable>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'gray' }}>
                                                {!!comment.dislikes && comment.dislikes}
                                            </Text>
                                        </View>
                                        <Pressable onPress={() => handleReply(comment)}>
                                            <Icon
                                                style={style.iconStyle}
                                                name='reply'
                                                type='font-awesome'
                                                color={'#565757'}
                                                size={20}
                                            />
                                        </Pressable>
                                        </View>
                                        <View style={{width: '30%',marginRight: 30 }}>
                                            <Pressable onPress={() => showOptions(comment)}>
                                                <Icon
                                                    style={{ ...style.iconStyle}}
                                                    name='ellipsis-v'
                                                    type='font-awesome'
                                                    color={'#565757'}
                                                    size={20}
                                                />
                                            </Pressable>
                                            {selectedComment?.id === comment.id && (
                                                <View style={style.optionsContainer}>
                                                    <Pressable onPress={() => handleReply(comment)}>
                                                        <Text style={style.optionText}>Reply </Text>
                                                    </Pressable>
                                                    {comment.user.id === user?.id && (
                                                        <Pressable onPress={() => deleteComment(comment.slug)}>
                                                            <Text style={style.optionText}>Delete</Text>
                                                        </Pressable>
                                                    )}
                                                </View>
                                            )}
                                        </View>

                                    </View>
                              
                                    <TouchableOpacity onPress={() => showReplies(comment)}>
                                        <Text style={style.totalReplies} >
                                            Reply {comment.repliesCount}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </View>
                )
            })}
        </ScrollView>
        <Modal
            animationType="slide"
            transparent={true}
            visible={showRepliesModel}
            onRequestClose={() => {
                setShowRepliesModal(false)
            }}>
            <View style={{
                height: '50%',
                marginTop: 'auto',
            }}>

                <View style={style.footer}>
                    <View>
                        <Pressable style={style.goBack} onPress={closeModel}>
                            <Icon
                                name="arrow-back"
                                type="material"
                                size={24}
                                color="black"
                                style={{ fontWeight: 'bold' }}
                            />
                            <Text style={{ ...style.subtitle, marginLeft: 10 }}>
                                Replies
                            </Text>
                        </Pressable>
                    </View>
                    <View style={{ flex: 1 }}>
                        <CommentRepliesView
                            updateMainComment={updateMainComment}
                            handleChildReply={handleChildReply}
                            handleParentReply={handleReply}
                            newReplyComment={newReplyComment}
                            parent={parent}
                            itemId={parent.itemId}
                        />
                        <CommentInputBox
                            messagePrefix={messagePrefix}
                            parentId={parent.id}
                            itemId={parent.itemId}
                            commentRef={commentRef}
                            addNewComment={updateNewReplyComment}
                            commentContainer={style.commentInputBody}
                            style={style.commentInput}
                            onDiscardText={discardText}
                            discardAlert={true}
                        />

                    </View>
                </View>
            </View>
        </Modal>
    </View>
    )
}

const style = StyleSheet.create({
    messageBody: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        minHeight: 80,
        paddingVertical: 10,
        shadowColor: "#000",
        paddingHorizontal: 10,
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 1,
        backgroundColor: bodyColor
    },
    messageView: {
        alignSelf: 'center',
        paddingLeft: 5,
    },
    message: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingRight: 40
    },
    totalReplies: {
        marginVertical: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: themeColor
    },
    footer: {
        flex: 1,
        backgroundColor: bodyColor,
        bottom: 0,
        left: 0,
        right: 0
    },
    subtitle: {
        marginVertical: 5,
        fontSize: 16,
        fontWeight: '700'
    },
    goBack: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    replyActions: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 5,
        justifyContent: 'space-between',
    }, iconStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 6,
        marginRight: 30,
        paddingLeft: 5
    },
    commentInput: {
        fontSize: 14,
        borderColor: 'gray',
        height: 50
    },
    commentInputBody: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bodyColor,
        paddingHorizontal: 40,
        bottom: 0,
        position: 'absolute',
        left: 0,
        right: 0
    },
    likesOrDislikeBody: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 25
    },
    optionsContainer: {
        position: 'absolute',
        top: -30,
        left: 0, // Changed to left side
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        zIndex: 1,
    },
    optionText: {
        padding: 10,
        fontSize: 14,
        color: 'black',
    },
    commentsLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 10,
    }
})

const mapToStateProps = (state: ApplicationState) => {
    return {
        token: state.userReducer.token,
        isAuthenticated: !!state.userReducer.token ? true : false,
        user : state.userReducer.user
    }
}

export default connect(mapToStateProps)(CommentView)