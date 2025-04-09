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
import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    enableTwitterOrX: {
        description: "Allow Twitter/X embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true,
    },
    twitterOrXEmbed: {
        description: "Enter which embedder to use for Twitter/X links.",
        type: OptionType.STRING,
        default: "vxtwitter",
    },
    enableInstagram: {
        description: "Allow Instagram embeds to be altered.",
        type: OptionType.BOOLEAN,
        default: true,
    },
    instagramEmbed: {
        description: "Enter which embedder to use for Instagram links.",
        type: OptionType.STRING,
        default: "ddinstagram",
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
});

function replacer(match: string): string {
    try {
        const url = new URL(match);

        if (settings.store.enableTwitterOrX && url.href.match(/^https?:\/\/(?:(?:.+)\.)?(twitter|x)\.com\/(.+)\/status\/(\d+)(\?.+)?$/)
        ) {
            return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?(twitter|x)\.com\/(.+)\/status\/(\d+)(\?.+)?$/,
                `https://${settings.store.twitterOrXEmbed}.com/$2/status/$3`
            );
        }

        if (settings.store.enableInstagram && url.href.match(/^https?:\/\/(?:(?:.+)\.)?instagram\.com\/(.+)/)
        ) {
            return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?instagram\.com\/(.+)/,
                `https://${settings.store.instagramEmbed}.com/$1`
            );
        }

        if (settings.store.enableReddit && url.href.match(/^https?:\/\/(?:(?:.+)\.)?reddit\.com\/(.+)/)
        ) {
            return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?reddit\.com\/(.+)/,
                `https://${settings.store.redditEmbed}.com/$1`
            );
        }

        if (settings.store.enableBluesky &&url.href.match(/^https?:\/\/(?:(?:.+)\.)?bsky\.app\/profile\/(.+)/)
        ) {
            return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?bsky\.app\/profile\/(.+)/,
                `https://${settings.store.blueskyEmbed}.app/profile/$1`
            );
        }

        if (settings.store.enableTiktok && url.href.match(/^https?:\/\/(?:(?:.+)\.)?tiktok\.com\/(.+?)(\?.+)?$/)
        ) {
            return url.href.replace(/^https?:\/\/(?:(?:.+)\.)?tiktok\.com\/(.+?)(\?.+)?$/,
                `https://${settings.store.tiktokEmbed}.com/$1`
            );
        }
        return url.href;
    } catch {
        return match;
    }
}

function rewriteContent(msg: MessageObject) {
    if (!msg?.content) return;
    msg.content = msg.content.replace(
        /(https?:\/\/[^\s<]+[^<.,:;"'>)|\]\s])/g,
        match => replacer(match)
    );
}

export default definePlugin({
    name: "FixSocialMediaEmbeds",
    description: "Changes links to make embeds work properly.",
    authors: [{ name: "Yoshoness", id: 206081832289042432n }],
    settings,

    start() { },
    stop() { },

    onBeforeMessageSend(_, msg) {
        rewriteContent(msg);
    },

    onBeforeMessageEdit(_, __, msg) {
        rewriteContent(msg);
    }
});
