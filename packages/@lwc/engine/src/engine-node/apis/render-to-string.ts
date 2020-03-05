/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { appendRootVM, getAssociatedVM } from '../../framework/vm';

import { HostNodeType, HostText, HostElement, HostShadowRoot, HostChildNode } from '../renderer';

function serializeChildren(nodes: HostChildNode[]): string {
    return nodes
        .map(node => {
            switch (node.type) {
                case HostNodeType.Text:
                    return serializeText(node);

                case HostNodeType.Element:
                    return serializeElement(node);
            }
        })
        .join('');
}

function serializeShadow(shadowRoot: HostShadowRoot): string {
    return `<template shadowroot>${serializeChildren(shadowRoot.children)}</template>`;
}

function serializeText(node: HostText): string {
    return node.value;
}

function serializeElement(element: HostElement): string {
    const attributes =
        element.attributes.length === 0
            ? ''
            : ' ' +
              element.attributes
                  .map(attr =>
                      attr.value === '' ? attr.name : `${attr.name}=${JSON.stringify(attr.value)}`
                  )
                  .join(' ');

    const shadowRoot = element.shadowRoot ? serializeShadow(element.shadowRoot) : '';
    const children = serializeChildren(element.children);

    return `<${element.name}${attributes}>${shadowRoot}${children}</${element.name}>`;
}

export function renderToString(element: HostElement): string {
    const vm = getAssociatedVM(element as any);
    appendRootVM(vm);

    return serializeElement(element);
}
