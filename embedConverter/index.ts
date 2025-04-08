/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2025 Vendicated and contributors
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

import { MessageObject } from "@api/MessageEvents";
import definePlugin, { OptionType} from "@utils/types";
import { definePluginSettings } from "@api/Settings";

// From lodash
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);

const settings = definePluginSettings({
    enableTwitterOrX: {
        description: "Allow Twitter/X embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true
    },
    twitterOrXEmbed: {
        description: "Enter which embedder to use for Twitter/X links.",
        type: OptionType.STRING,
        default: "vxtwitter",
        disabled: () => settings.store.enableTwitterOrX !== true,
    },
    enableInstagram: {
        description: "Allow Instagram embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true
    },
    instagramEmbed: {
        description: "Enter which embedder to use for Instagram links.",
        type: OptionType.STRING,
        default: "ddinstagram",
        disabled: () => settings.store.enableInstagram !== true,
    },
    enableReddit: {
        description: "Allow Reddit embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true
    },
    redditEmbed: {
        description: "Enter which embedder to use for Reddit links.",
        type: OptionType.STRING,
        default: "vxreddit",
        disabled: () => settings.store.enableReddit !== true,
    },
    enableBluesky: {
        description: "Allow BlueSky embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true
    },
    BlueskyEmbed: {
        description: "Enter which embedder to use for Reddit links.",
        type: OptionType.STRING,
        default: "bskye",
        disabled: () => settings.store.enableBluesky !== true,
    },
    enableTiktok: {
        description: "Allow TikTok embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true
    },
    tiktokEmbed: {
        description: "Enter which embedder to use for TikTok links.",
        type: OptionType.STRING,
        default: "tnktok",
        disabled: () => settings.store.enableTiktok !== true,
    },
})

export default definePlugin({
    name: "FixSocialMediaEmbeds",
    description: "Changes links to make embeds work properly.",
    authors: [{ name: "Yoshoness", id: 206081832289042432n }],
    settings,

    start() { },

    onBeforeMessageSend(_, msg) {
        return this.onSend(msg);
    },

    onBeforeMessageEdit(_cid, _mid, msg) {
        return this.onSend(msg);
    },

    escapeRegExp(str: string) {
        return (str && reHasRegExpChar.test(str))
            ? str.replace(reRegExpChar, "\\$&")
            : (str || "");
    },

    replacer(match: string) {

        try {
            var url = new URL(match);
        } catch (error) {
            return match;
        }

        //twitter
        try {
            if (settings.store.enableTwitterOrX && url.href.match(/^https+:\/\/(?:(?:.+)\.)?(?:twitter|x)\.com\/(.+)\/status\/(\d+)(\?.+)?$/)) {
                return url.href.replace(/^https+:\/\/(?:(?:.+)\.)?(?:twitter|x)\.com\/(.+)\/status\/(\d+)(\?.+)?$/,
                    ['https://', settings.store.twitterOrXEmbed, '.com/$1/status/$2'].join(''));
            }
        } catch (error) {
            return match;
        }

        //instagram
        try {
            if (settings.store.enableInstagram && url.href.match(/^https+:\/\/(?:(?:.+)\.)?instagram\.com\/(.+)/)) {
                return url.href.replace(/^https+:\/\/(?:(?:.+)\.)?instagram\.com\/(.+)/,
                    ['https://', settings.store.instagramEmbed, '.com/$1'].join(''));
            }
        } catch (error) {
            return match;
        }

        //reddit
        try {
            if (settings.store.enableReddit && url.href.match(/^https+:\/\/(?:(?:.+)\.)?reddit\.com\/(.+)/)) {
                return url.href.replace(/^https+:\/\/(?:(?:.+)\.)?reddit\.com\/(.+)/,
                    ["https://", settings.store.redditEmbed, ".com/$1"].join(''));
            }
        } catch (error) {
            return match;
        }

        //bluesky
        try {
            if (settings.store.enableBluesky && url.href.match(/^https+:\/\/(?:(?:.+)\.)?bsky\.app\/profile\/(.+)/)) {
                return url.href.replace(/^https+:\/\/(?:(?:.+)\.)?bsky\.app\/profile\/(.+)/,
                    ["https://", settings.store.BlueskyEmbed, ".app/profile/$1"].join(''));
            }
        } catch (error) {
            return match;
        }

        //tiktok
        try {
            if (settings.store.enableTiktok && url.href.match(/^https+:\/\/(?:(?:.+)\.)?tiktok\.com\/(.+)\?(.+)/)) {
                return url.href.replace(/^https+:\/\/(?:(?:.+)\.)?tiktok\.com\/(.+)\?(.+)/,
                    ["https://", settings.store.tiktokEmbed, ".com/$1"].join(''));
            }
        } catch (error) {
            return match;
        }

        return url.toString();
    },

    onSend(msg: MessageObject) {
        // Only run on messages that contain URLs
        if (msg.content.match(/http(s)?:\/\//)) {
            msg.content = msg.content.replace(
                /(https?:\/\/[^\s<]+[^<.,:;"'>)|\]\s])/g,
                match => this.replacer(match)
            );
        }
    },
});
