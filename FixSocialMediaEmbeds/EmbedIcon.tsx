/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { ChatBarButton, ChatBarButtonFactory } from "@api/ChatButtons";
import { classNameFactory } from "@utils/css";
import { classes } from "@utils/misc";
import { IconComponent } from "@utils/types";
import { Tooltip, useEffect, useState } from "@webpack/common";
import { settings } from "./index";

export const cl = classNameFactory("vc-embed-");

export const EmbedIcon: IconComponent = ({ height = 20, width = 20, className }) => {
    return (
        <svg
            viewBox="0 0 512 512"
            height={height}
            width={width}
            className={classes(cl("icon"), className)}
        >
            <path fill="currentColor" d="M153.527,138.934c-0.29,0-0.581,0.088-0.826,0.258L0.641,242.995C0.238,243.27,0,243.721,0,244.213v27.921
		c0,0.484,0.238,0.943,0.641,1.21l152.06,103.811c0.246,0.17,0.536,0.258,0.826,0.258c0.238,0,0.468-0.064,0.686-0.169
		c0.484-0.258,0.782-0.758,0.782-1.306v-44.478c0-0.476-0.238-0.936-0.641-1.202L48.769,258.166l105.585-72.068
		c0.403-0.282,0.641-0.734,0.641-1.226V140.41c0-0.548-0.298-1.049-0.782-1.299C153.995,138.991,153.765,138.934,153.527,138.934z"
            />
            <path fill="currentColor" d="M511.358,242.995l-152.06-103.803c-0.246-0.169-0.536-0.258-0.827-0.258c-0.238,0-0.467,0.056-0.685,0.177
		c-0.484,0.25-0.782,0.751-0.782,1.299v44.478c0,0.484,0.238,0.936,0.641,1.21l105.586,72.068l-105.586,72.092
		c-0.403,0.266-0.641,0.725-0.641,1.217v44.462c0,0.548,0.298,1.049,0.782,1.306c0.218,0.105,0.448,0.169,0.685,0.169
		c0.291,0,0.581-0.088,0.827-0.258l152.06-103.811c0.404-0.267,0.642-0.726,0.642-1.21v-27.921
		C512,243.721,511.762,243.27,511.358,242.995z"/>
            <path fill="currentColor" d="M325.507,114.594h-42.502c-0.629,0-1.186,0.395-1.387,0.984l-96.517,279.885
		c-0.153,0.443-0.08,0.943,0.194,1.322c0.278,0.387,0.722,0.621,1.198,0.621h42.506c0.625,0,1.182-0.395,1.387-0.992l96.513-279.868
		c0.153-0.452,0.081-0.952-0.193-1.339C326.427,114.828,325.982,114.594,325.507,114.594z"/>
        </svg>
    );
};

export let setShouldShowEmbedEnabledTooltip: undefined | ((show: boolean) => void);

export const EmbedChatBarIcon: ChatBarButtonFactory = ({ isMainChat }) => {
    const { autoConvert } = settings.use(["autoConvert"]);

    const [shouldShowEmbedEnabledTooltip, setter] = useState(false);
    useEffect(() => {
        setShouldShowEmbedEnabledTooltip = setter;
        return () => setShouldShowEmbedEnabledTooltip = undefined;
    }, []);

    if (!isMainChat) return null;

    const toggle = () => {
        const newState = !autoConvert;
        settings.store.autoConvert = newState;
    };

    const button = (
        <ChatBarButton
            tooltip="Auto-convert Embeds"
            onClick={e => {
                return toggle();
            }}
            onContextMenu={toggle}
            buttonProps={{
                "aria-haspopup": "dialog"
            }}
        >
            <EmbedIcon className={cl({ "auto-convert": autoConvert, "chat-button": true })} />
        </ChatBarButton>
    );
    if (shouldShowEmbedEnabledTooltip)
        return (
            <Tooltip text="Auto Translate Enabled" forceOpen>
                {() => button}
            </Tooltip>
        );

    return button;
};
