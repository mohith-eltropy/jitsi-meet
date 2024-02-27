import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { openDialog } from '../../../base/dialog/actions';
import { IconUserDeleted } from '../../../base/icons/svg';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';
import { NOTIFY_CLICK_MODE } from '../../../toolbox/constants';
import { IButtonProps } from '../../types';

import DemoteToVisitorRemoteParticipantDialog from './DemoteToVisitorDialog';

interface IProps extends IButtonProps {

    /**
     * Button text class name.
     */
    className?: string;

    /**
     * Whether the icon should be hidden or not.
     */
    noIcon?: boolean;

    /**
     * Click handler executed aside from the main action.
     */
    onClick?: Function;
}

/**
 * Implements a React {@link Component} which displays a button for demoting a participant to visitor.
 *
 * @returns {JSX.Element}
 */
const DemoteToVisitorButton = ({
    className,
    noIcon = false,
    notifyClick,
    notifyMode,
    participantID
}: IProps): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        notifyClick?.();
        if (notifyMode === NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            return;
        }
        dispatch(openDialog(DemoteToVisitorRemoteParticipantDialog, { participantID }));
    }, [ dispatch, notifyClick, notifyMode, participantID ]);

    return (
        <ContextMenuItem
            accessibilityLabel = { t('videothumbnail.demote') }
            className = { className || 'demotelink' } // can be used in tests
            icon = { noIcon ? null : IconUserDeleted }
            id = { `demotelink_${participantID}` }
            onClick = { handleClick }
            text = { t('videothumbnail.demote') } />
    );
};

export default DemoteToVisitorButton;
