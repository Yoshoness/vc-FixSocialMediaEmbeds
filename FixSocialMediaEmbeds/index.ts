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

import "./style.css";

import { MessageObject } from "@api/MessageEvents";
import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { Toasts, showToast } from "@webpack/common";
import { EmbedChatBarIcon, EmbedIcon } from "./EmbedIcon";

export const settings = definePluginSettings({
    enableTwitterOrX: {
        description: "Allow Twitter/X embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true,
    },
    twitterOrXEmbed: {
        description: "Enter which embedder to use for Twitter/X links.",
        type: OptionType.STRING,
        default: "fxtwitter",
    },
    enableInstagram: {
        description: "Allow Instagram embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true,
    },
    instagramEmbed: {
        description: "Enter which embedder to use for Instagram links.",
        type: OptionType.STRING,
        default: "vxinstagram",
    },
    enableReddit: {
        description: "Allow Reddit embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true,
    },
    redditEmbed: {
        description: "Enter which embedder to use for Reddit links.",
        type: OptionType.STRING,
        default: "vxreddit",
    },
    enableBluesky: {
        description: "Allow BlueSky embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true,
    },
    blueskyEmbed: {
        description: "Enter which embedder to use for BlueSky links.",
        type: OptionType.STRING,
        default: "bskye",
    },
    enableTiktok: {
        description: "Allow TikTok embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true,
    },
    tiktokEmbed: {
        description: "Enter which embedder to use for TikTok links.",
        type: OptionType.STRING,
        default: "tnktok",
    },
    autoConvert: {
        type: OptionType.BOOLEAN,
        description: "Automatically convert your links before sending.",
        default: true
    }
})

function replacer(match: string): string {
    try {
        // check for <> around url in order to send normal embed
        let tempurl = match.match(/^<(.*)+>$/) ? match.substring(1, match.length - 1) : match;
        let noFix = match.match(/^<(.*)+>$/) ? true : false,
            matchSite = false;

        let url = new URL(tempurl);

        if (settings.store.enableTwitterOrX && url.href.match(/^https?:\/\/(?:(?:.+)\.)?(twitter|x)\.com\/(.+)\/status\/(\d+(\/photo\/.)?)(\?.+)?/)) {
            matchSite = true;
            if (!settings.store.twitterOrXEmbed) settings.store.twitterOrXEmbed = "fxtwitter";
            if (!noFix) {
                showToast("Link altered to fix embed.", Toasts.Type.SUCCESS);
                return new URL(match).href.replace(/^https?:\/\/(?:(?:.+)\.)?(twitter|x)\.com\/(.+)\/status\/(\d+(\/photo\/.)?)(\?.+)?/,
                    `https://${settings.store.twitterOrXEmbed}.com/$2/status/$3`
                );
            }
        }

        else if (settings.store.enableInstagram && url.href.match(/^https?:\/\/(?:(?:.+)\.)?instagram\.com\/(p|reel)\/(.+)/)) {
            matchSite = true;
            if (!settings.store.instagramEmbed) settings.store.instagramEmbed = "vxinstagram";
            if (!noFix) {
                showToast("Link altered to fix embed.", Toasts.Type.SUCCESS);
                return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?instagram\.com\/(p|reel)\/(.+)/,
                    `https://${settings.store.instagramEmbed}.com/$1/$2`
                );
            }
        }

        else if (settings.store.enableReddit && url.href.match(/^https?:\/\/(?:(?:.+)\.)?reddit\.com\/(.+)/)) {
            matchSite = true;
            if (!settings.store.redditEmbed) settings.store.redditEmbed = "vxreddit";
            if (!noFix) {
                showToast("Link altered to fix embed.", Toasts.Type.SUCCESS);
                return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?reddit\.com\/(.+)/,
                    `https://${settings.store.redditEmbed}.com/$1`
                );
            }
        }

        else if (settings.store.enableBluesky && url.href.match(/^https?:\/\/(?:(?:.+)\.)?bsky\.app\/profile\/(.+)/)) {
            matchSite = true;
            if (!settings.store.blueskyEmbed) settings.store.blueskyEmbed = "bskye";
            if (!noFix) {
                showToast("Link altered to fix embed.", Toasts.Type.SUCCESS);
                return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?bsky\.app\/profile\/(.+)/,
                    `https://${settings.store.blueskyEmbed}.app/profile/$1`
                );
            }
        }

        else if (settings.store.enableTiktok && url.href.match(/^https?:\/\/(?:(?:.+)\.)?tiktok\.com\/(.+?)(\?.+)?$/)) {
            matchSite = true;
            if (!settings.store.tiktokEmbed) settings.store.tiktokEmbed = "tnktok";
            if (!noFix) {
                showToast("Link altered to fix embed.", Toasts.Type.SUCCESS);
                return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?tiktok\.com\/(.+?)(\?.+)?$/,
                    `https://${settings.store.tiktokEmbed}.com/$1`
                );
            }
        }

        if (noFix && !matchSite) //if site didn't match but is set to not be embedded
            return match
        return url.href //return base url if site matches and is omitted
    } catch {
        return match;
    }
}

function rewriteContent(msg: MessageObject) {
    if (!msg?.content) return;
    msg.content = msg.content.replace(
        /<?(https?:\/\/[^\s<]+[^<.,:;"'>)|\]\s])>?/g,
        match => replacer(match)
    );
}

export default definePlugin({
    name: "FixSocialMediaEmbeds",
    description: "Changes links to make embeds work properly.",
    authors: [{ name: "Yoshoness", id: 206081832289042432n }],
    settings,

    chatBarButton: {
        icon: EmbedIcon,
        render: EmbedChatBarIcon
    },

    onBeforeMessageSend(_, msg) {
        if (!settings.store.autoConvert) return;
        rewriteContent(msg);
    },
});
