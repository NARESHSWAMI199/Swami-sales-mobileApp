import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Avatar, Button, Input } from "react-native-elements"
import { TouchableOpacity } from "react-native"
import CommentRepliesView from "./CommentReplies"
import { bodyColor, commentUrl, defaultAvtar, themeColor, userImageUrl } from "../utils/utils"
import { Icon } from "@rneui/themed"
import CommentInputBox from "./CommentInputBox"
import { connect } from "react-redux"
import { ApplicationState } from "../redux"
import { logError, logInfo } from '../utils/logger' // Import logger
import { useNavigation, NavigationProp } from '@react-navigation/native'

const itemsPerPage = 10
const CommentView = (props: any) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { itemId } = props
    const [comments, setComments] = useState<any>([])
    const [parent, setParent] = useState<any>({})
    const [showRepliesModel, setShowRepliesModal] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const commentRef = useRef(null);
    const [messagePrefix, setMessagePrefix] = useState('')

    const [token, setToken] = useState<string>()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>()
    const [totalElements, setTotalElements] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    // Effect to get token from props
    useEffect(() => {
        const getData = async () => {
            setToken(await props.token)
            setIsAuthenticated(!!(await props.token) ? true : false)
            logInfo(`Token and authentication state set`)
        }
        getData()
    }, [props.token])

    // Effect to fetch comments
    useEffect(() => {
        logInfo(`Fetching comments for itemId: ${itemId} and header: ${axios.defaults.headers['Authorization']}`)
        setLoading(true);
        axios.post(commentUrl + "all", {
            itemId: itemId,
            pageNumber: currentPage,
            pageSize: itemsPerPage
        })
            .then(res => {
                let response = res.data;
                setComments(prevComments => [...prevComments, ...response.content])
                setTotalElements(response.totalElements)
                logInfo(`Comments fetched successfully`)
                setLoading(false);
            })
            .catch(err => {
                logError(`Error fetching comments: ${err.message}`)
                setLoading(false);
            })
    }, [props.isCommentUpdate, token, currentPage])

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

    // Function to refresh comment replies
    const refreshCommentReplies = () => {
        setRefresh(refresh ? false : true)
        logInfo(`Refreshing comment replies`)
    }

    // Function to handle reply action
    const handleReply = (parent: any) => {
        if (!isAuthenticated) {
            navigation.navigate('Login' as never);
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
            navigation.navigate('Login' as never);
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
            navigation.navigate('Login' as never);
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
            navigation.navigate('Login' as never);
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
                    _comment.isDisliked = comment.isDisliked
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

    // Effect to handle navigation focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Refresh comments when the screen is focused
            setRefresh(refresh ? false : true);
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
                                        uri: !!comment.user.avtar ? userImageUrl + comment.user.slug + "/" + comment.user.avtar : defaultAvtar
                                    }} />
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
                                    <View style={{ ...style.replyActions }}>
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

                                        <Pressable>
                                            <Icon
                                                style={{ ...style.iconStyle, marginLeft: 100 }}
                                                name='ellipsis-v'
                                                type='font-awesome'
                                                color={'#565757'}
                                                size={20}
                                            />
                                        </Pressable>
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
                            refresh={refresh}
                            parent={parent}
                            itemId={parent.itemId}
                        />
                        <CommentInputBox
                            messagePrefix={messagePrefix}
                            parentId={parent.id}
                            itemId={parent.itemId}
                            commentRef={commentRef}
                            isCommentUpdated={refreshCommentReplies}
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
        width: '70%',
        marginTop: 5,
        justifyContent: 'space-between', // Add space between elements
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
    }
})

const mapToStateProps = (state: ApplicationState) => {
    return {
        token: state.userReducer.token,
        isAuthenticated: !!state.userReducer.token ? true : false
    }
}

export default connect(mapToStateProps)(CommentView)