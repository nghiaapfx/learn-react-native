import React from 'react'
import {View, ScrollView, FlatList, TouchableHighlight} from 'react-native'
import {NavigationInjectedProps, withNavigation} from 'react-navigation'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/Ionicons'

import {Card, Name, Content, Container, MatchTag, GradientTag} from '../components/Shared'
import {Match} from '../model'
import {FONT_WEIGHT_STYLE} from '../theme'
import {getImages} from '../services/imageService'

const Avatar = styled.Image`
    width: 100%;
    aspect-ratio: 0.9;
`

const UserContainer = styled.View`
    position: absolute;
    top: -25px;
    width: 100%;
    padding: 0 20px;
`

const UserInfo = styled(Card)`
    padding: 10px 10px 15px;
    text-align: center;
    align-items: center;
`

const PhotoContainer = styled(Card)`
    margin-top: 20px;
    padding: 15px 20px 0;
`

const Photo = styled.Image`
    width: 48%;
    border-radius: 15px;
    aspect-ratio: 0.6667;
    margin-bottom: 15px;
`

const Controls = styled.View`
    margin: 0 auto;
    padding-top: 20px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
`

const GradientButton = styled(GradientTag)`
    padding: 15px 20px;
    border-radius: 55px;
    margin-left: 20px;
    height: 55px;
`
const ButtonText = styled.Text`
    color: white;
    font-family: ${FONT_WEIGHT_STYLE[400]};
`

const BackButton = styled.TouchableOpacity`
    position: absolute;
    top: 30px;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
`

const FullInfo = styled.View`
    width: 100%;
    padding-left: 10px;
    margin-top: 10px;
`

interface Props {
    profile: Match
    isOther?: boolean
}

const UserProfileComponent: React.FC<Props & NavigationInjectedProps> = ({profile, isOther, navigation}) => {
    const [bgHeight, setBgHeight] = React.useState(600)
    const defaultPhotos = [
        'https://source.unsplash.com/random/400x600',
        'https://source.unsplash.com/random/401x600',
        'https://source.unsplash.com/random/400x601',
        'https://source.unsplash.com/random/401x601',
    ]
    const [photos, setPhotos] = React.useState(defaultPhotos)

    let scrollView: ScrollView | null = null
    const {avatar, name, age, bio, percent, fullInfo} = profile
    React.useEffect(() => {
        if (scrollView) {
            scrollView.scrollTo({x: 0, y: 0, animated: false})
        }

        if (isOther) {
            getImages(profile.name).then(images => setPhotos(images))
        } else {
            setPhotos(defaultPhotos)
        }
    }, [profile])
    return (
        <ScrollView
            ref={view => {
                scrollView = view
            }}
            style={{display: 'flex'}}
            nestedScrollEnabled={false}>
            <Avatar source={{uri: avatar}} />

            {isOther && (
                <BackButton
                    onPress={() => {
                        //This only work with react-navigation-tabs ver 1.0.0
                        navigation.goBack()
                    }}>
                    <Icon name="ios-arrow-back" color="white" size={40} />
                </BackButton>
            )}

            <View style={{position: 'relative', zIndex: 2}}>
                <UserContainer
                    onLayout={e => {
                        const height = e.nativeEvent.layout.height
                        setBgHeight(height - 5)
                    }}>
                    {isOther && <MatchTag percent={percent} />}
                    <UserInfo>
                        {isOther && <View style={{height: 10}} />}
                        <Name>
                            {name} ({age} tuổi)
                        </Name>
                        <Content>{bio}</Content>
                        {fullInfo && (
                            <FullInfo>
                                {fullInfo.blood.length > 0 && (
                                    <Content>
                                        <Icon name="ios-water" /> Nhóm máu: {fullInfo.blood}
                                    </Content>
                                )}
                                {fullInfo.birthPlace.length > 0 && (
                                    <Content>
                                        <Icon name="ios-planet" /> Nguyên quán: {fullInfo.birthPlace}
                                    </Content>
                                )}
                                <Content>
                                    <Icon name="ios-woman" /> Chiều cao: {fullInfo.height}
                                </Content>
                                <Content>
                                    <Icon name="ios-heart" /> Số đo 3 vòng: {fullInfo.threeSizes}
                                </Content>
                            </FullInfo>
                        )}
                    </UserInfo>

                    {isOther && (
                        <Controls>
                            <TouchableHighlight>
                                <GradientButton style={{width: 55}}>
                                    <Icon name="ios-more" color="white" size={15} />
                                </GradientButton>
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <GradientButton>
                                    <ButtonText>
                                        <Icon name="ios-chatboxes" color="white" size={15} /> Start Chatting
                                    </ButtonText>
                                </GradientButton>
                            </TouchableHighlight>
                        </Controls>
                    )}

                    <PhotoContainer>
                        <Name style={{marginBottom: 10}}>Photos</Name>

                        <FlatList
                            data={photos}
                            numColumns={2}
                            columnWrapperStyle={{justifyContent: 'space-between'}}
                            scrollEnabled={false}
                            keyExtractor={(_, index) => String(index)}
                            renderItem={({item}) => <Photo source={{uri: item}} />}
                        />
                    </PhotoContainer>
                </UserContainer>
            </View>
            <Container style={{height: bgHeight}} />
        </ScrollView>
    )
}

export const UserProfile = withNavigation(UserProfileComponent)
