import { __assign } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import clsx from 'clsx';
import ButtonTrigger from '../../internal/components/button-trigger';
import styles from './styles.css.js';
import Option from '../../internal/components/option';
import { generateUniqueId } from '../../internal/hooks/use-unique-id';
import { joinStrings } from '../../internal/utils/strings';
var Trigger = React.forwardRef(function (_a, ref) {
    var ariaLabelledby = _a.ariaLabelledby, ariaDescribedby = _a.ariaDescribedby, controlId = _a.controlId, invalid = _a.invalid, triggerProps = _a.triggerProps, selectedOption = _a.selectedOption, triggerVariant = _a.triggerVariant, inFilteringToken = _a.inFilteringToken, isOpen = _a.isOpen, placeholder = _a.placeholder, disabled = _a.disabled;
    var id = useMemo(function () { return controlId !== null && controlId !== void 0 ? controlId : generateUniqueId(); }, [controlId]);
    var triggerContentId = generateUniqueId('trigger-content-');
    var triggerContent = null;
    if (!selectedOption) {
        triggerContent = (React.createElement("span", { "aria-disabled": "true", className: clsx(styles.placeholder, styles.trigger), id: triggerContentId }, placeholder));
    }
    else if (triggerVariant === 'option') {
        triggerContent = React.createElement(Option, { id: triggerContentId, option: __assign(__assign({}, selectedOption), { disabled: disabled }), triggerVariant: true });
    }
    else {
        triggerContent = (React.createElement("span", { id: triggerContentId, className: styles.trigger }, selectedOption.label || selectedOption.value));
    }
    var mergedRef = useMergeRefs(triggerProps.ref, ref);
    return (React.createElement(ButtonTrigger, __assign({}, triggerProps, { id: id, ref: mergedRef, pressed: isOpen, disabled: disabled, invalid: invalid, inFilteringToken: inFilteringToken, ariaDescribedby: ariaDescribedby, ariaLabelledby: joinStrings(ariaLabelledby, triggerContentId) }), triggerContent));
});
export default Trigger;
//# sourceMappingURL=trigger.js.map