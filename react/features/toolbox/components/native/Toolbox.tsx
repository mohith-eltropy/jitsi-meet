import React from 'react';
import { View, ViewStyle, TouchableHighlight,Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { IReduxState } from '../../../app/types';
import ColorSchemeRegistry from '../../../base/color-scheme/ColorSchemeRegistry';
import Platform from '../../../base/react/Platform.native';
import ChatButton from '../../../chat/components/native/ChatButton';
import ReactionsMenuButton from '../../../reactions/components/native/ReactionsMenuButton';
import { shouldDisplayReactionsButtons } from '../../../reactions/functions.any';
import TileViewButton from '../../../video-layout/components/TileViewButton';
import { iAmVisitor } from '../../../visitors/functions';
import { getMovableButtons, isToolboxVisible } from '../../functions.native';
import HangupButton from '../HangupButton';

import AudioMuteButton from './AudioMuteButton';
import HangupMenuButton from './HangupMenuButton';
import OverflowMenuButton from './OverflowMenuButton';
import RaiseHandButton from './RaiseHandButton';
import ScreenSharingButton from './ScreenSharingButton';
import VideoMuteButton from './VideoMuteButton';
import styles from './styles';
import Button from "../../../base/ui/components/native/Button";
import Icon from "../../../base/icons/components/Icon";
import {
    IconArrowDown,
    IconArrowDownLarge,
    IconArrowUp
} from "../../../base/icons/svg";
import BaseIndicator from "../../../base/react/components/native/BaseIndicator";
import LargeVideo from "../../../large-video/components/LargeVideo.native";
import BaseTheme from '../../../base/ui/components/BaseTheme.native';

/**
 * The type of {@link Toolbox}'s React {@code Component} props.
 */
interface IProps {

    /**
     * Whether the end conference feature is supported.
     */
    _endConferenceSupported: boolean;

    /**
     * Whether we are in visitors mode.
     */
    _iAmVisitor: boolean;

    /**
     * Whether or not any reactions buttons should be visible.
     */
    _shouldDisplayReactionsButtons: boolean;

    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: any;

    /**
     * The indicator which determines whether the toolbox is visible.
     */
    _visible: boolean;

    /**
     * The width of the screen.
     */
    _width: number;
}

/**
 * Implements the conference Toolbox on React Native.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}.
 */
function Toolbox(props: IProps) {
    const { _endConferenceSupported, _shouldDisplayReactionsButtons, _styles, _visible, _iAmVisitor, _width, isLayoutExpanded, handleExpandedIconClick } = props;

    if (!_visible) {
        return null;
    }

    const bottomEdge = Platform.OS === 'ios' && _visible;
    const { buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;
    const additionalButtons = getMovableButtons(_width);
    const backgroundToggledStyle = {
        ...toggledButtonStyles,
        style: [
            toggledButtonStyles.style,
            _styles.backgroundToggle
        ]
    };
    const heightOfToolbox = isLayoutExpanded ? 150 : 70;
    const backgroundColor = isLayoutExpanded ? BaseTheme.palette.ui09 : BaseTheme.palette.ui10;
    const toolboxPadding = isLayoutExpanded ? 0 : BaseTheme.spacing[2]
    const style = { ...styles.toolbox, height: heightOfToolbox, backgroundColor: backgroundColor, paddingHorizontal: toolboxPadding };


    // we have only hangup and raisehand button in _iAmVisitor mode
    if (_iAmVisitor) {
        additionalButtons.add('raisehand');
        style.justifyContent = 'center';
    }

    return (
        <View >
            <View
                // accessibilityRole = 'toolbar'

                // @ts-ignore
                // edges = { [ bottomEdge && 'bottom' ].filter(Boolean) }
                // pointerEvents = 'box-none'
                style = { style as ViewStyle }>
                <View style={{flexDirection: 'row', alignSelf: 'stretch'}}>
                    {isLayoutExpanded && !_iAmVisitor &&
                        <View style={{height: 150, width: 150, backgroundColor: "#000"}}>
                            <LargeVideo />
                        </View>

                    }
                    <View style={{flexDirection: 'row',alignSelf: 'stretch', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                        {!_iAmVisitor &&
                            <View>
                                <VideoMuteButton
                                    styles = { buttonStylesBorderless }
                                />
                            </View>

                        }
                        {!_iAmVisitor && <AudioMuteButton
                            styles = { buttonStylesBorderless }
                            toggledStyles = { toggledButtonStyles } />
                        }
                        {!_iAmVisitor &&
                        <TouchableHighlight onPress={()=>{handleExpandedIconClick()}}>
                            <View style={{marginLeft: 16}}>
                                {!isLayoutExpanded ?
                                    <BaseIndicator
                                        icon = { IconArrowDown }
                                        iconStyle = {{
                                            color: "#000"
                                        }} />
                                        :
                                    <BaseIndicator
                                        icon = { IconArrowUp }
                                        iconStyle = {{
                                            color: "#000"
                                        }} />
                                }

                                {/*<Text>is Expanded</Text>*/}
                            </View>
                            </TouchableHighlight>
                        }
                    </View>
                </View>

                { !isLayoutExpanded && (_endConferenceSupported
                    ? <HangupMenuButton />
                    : <HangupButton
                        styles = { hangupButtonStyles }
                    />)
                }
            </View>
        </View>
    );
}

/**
 * Maps parts of the redux state to {@link Toolbox} (React {@code Component})
 * props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code Toolbox} props.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState) {
    const { conference } = state['features/base/conference'];
    const endConferenceSupported = conference?.isEndConferenceSupported();

    return {
        _endConferenceSupported: Boolean(endConferenceSupported),
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: true,
        _iAmVisitor: iAmVisitor(state),
        _width: state['features/base/responsive-ui'].clientWidth,
        _shouldDisplayReactionsButtons: shouldDisplayReactionsButtons(state)
    };
}

export default connect(_mapStateToProps)(Toolbox);
