import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Control, Controller } from "react-hook-form";
import {
  ActionGroup,
  Button,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
} from "@patternfly/react-core";

import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { TimeSelector } from "../../components/time-selector/TimeSelector";
import { TokenLifespan } from "./TokenLifespan";
import { AttributeInput } from "../../components/attribute-input/AttributeInput";

type AdvancedSettingsProps = {
  control: Control<Record<string, any>>;
  save: () => void;
  reset: () => void;
  protocol?: string;
};

export const AdvancedSettings = ({
  control,
  save,
  reset,
  protocol,
}: AdvancedSettingsProps) => {
  const { t } = useTranslation("clients");
  const [open, setOpen] = useState(false);
  return (
    <FormAccess role="manage-realm" isHorizontal>
      {protocol !== "openid-connect" && (
        <FormGroup
          label={t("assertionLifespan")}
          fieldId="assertionLifespan"
          labelIcon={
            <HelpItem
              helpText="clients-help:assertionLifespan"
              fieldLabelId="clients:assertionLifespan"
            />
          }
        >
          <Controller
            name="attributes.saml.assertion.lifespan"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <TimeSelector
                units={["minute", "day", "hour"]}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </FormGroup>
      )}
      {protocol === "openid-connect" && (
        <>
          <TokenLifespan
            id="accessTokenLifespan"
            name="attributes.access.token.lifespan"
            defaultValue=""
            units={["minute", "day", "hour"]}
            control={control}
          />

          <FormGroup
            label={t("oAuthMutual")}
            fieldId="oAuthMutual"
            hasNoPaddingTop
            labelIcon={
              <HelpItem
                helpText="clients-help:oAuthMutual"
                fieldLabelId="clients:oAuthMutual"
              />
            }
          >
            <Controller
              name="attributes.tls-client-certificate-bound-access-tokens"
              defaultValue={false}
              control={control}
              render={({ onChange, value }) => (
                <Switch
                  id="oAuthMutual-switch"
                  label={t("common:on")}
                  labelOff={t("common:off")}
                  isChecked={value === "true"}
                  onChange={(value) => onChange("" + value)}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("keyForCodeExchange")}
            fieldId="keyForCodeExchange"
            hasNoPaddingTop
            labelIcon={
              <HelpItem
                helpText="clients-help:keyForCodeExchange"
                fieldLabelId="clients:keyForCodeExchange"
              />
            }
          >
            <Controller
              name="attributes.pkce.code.challenge.method"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="keyForCodeExchange"
                  variant={SelectVariant.single}
                  onToggle={setOpen}
                  isOpen={open}
                  onSelect={(_, value) => {
                    onChange(value);
                    setOpen(false);
                  }}
                  selections={[value || t("common:choose")]}
                >
                  {["", "S256", "plain"].map((v) => (
                    <SelectOption key={v} value={v}>
                      {v || t("common:choose")}
                    </SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("pushedAuthorizationRequestRequired")}
            fieldId="pushedAuthorizationRequestRequired"
            labelIcon={
              <HelpItem
                helpText="clients-help:pushedAuthorizationRequestRequired"
                fieldLabelId="clients:pushedAuthorizationRequestRequired"
              />
            }
          >
            <Controller
              name="attributes.require.pushed.authorization.requests"
              defaultValue="false"
              control={control}
              render={({ onChange, value }) => (
                <Switch
                  id="pushedAuthorizationRequestRequired"
                  label={t("common:on")}
                  labelOff={t("common:off")}
                  isChecked={value === "true"}
                  onChange={(value) => onChange(value.toString())}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("acrToLoAMapping")}
            fieldId="acrToLoAMapping"
            labelIcon={
              <HelpItem
                helpText="clients-help:acrToLoAMapping"
                fieldLabelId="clients:acrToLoAMapping"
              />
            }
          >
            <AttributeInput name="attributes.acr.loa.map" />
          </FormGroup>
        </>
      )}
      <ActionGroup>
        <Button variant="secondary" onClick={save}>
          {t("common:save")}
        </Button>
        <Button variant="link" onClick={reset}>
          {t("common:revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
