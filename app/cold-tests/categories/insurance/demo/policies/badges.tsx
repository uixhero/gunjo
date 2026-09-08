import * as React from "react";
import { Badge } from "@gunjo/ui";
import {
  IconCircleCheck,
  IconClockExclamation,
  IconRefresh,
  IconCircleX,
  IconBan,
  IconMailForward,
  IconMailOff,
  IconMailCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import type { PolicyStatus, RenewalNoticeStatus } from "./data";
import { STATUS_LABEL, RENEWAL_NOTICE_LABEL } from "./data";

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const STATUS_CONFIG: Record<
  PolicyStatus,
  { variant: BadgeVariant; icon: React.ReactNode }
> = {
  active: { variant: "success", icon: <IconCircleCheck /> },
  expiring: { variant: "warning", icon: <IconClockExclamation /> },
  renewing: { variant: "info", icon: <IconRefresh /> },
  lapsed: { variant: "destructive", icon: <IconCircleX /> },
  cancelled: { variant: "outline", icon: <IconBan /> },
};

export function StatusBadge({ status }: { status: PolicyStatus }) {
  const { variant, icon } = STATUS_CONFIG[status];
  return (
    <Badge variant={variant} icon={icon}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

const NOTICE_CONFIG: Record<
  RenewalNoticeStatus,
  { variant: BadgeVariant; icon: React.ReactNode }
> = {
  not_sent: { variant: "outline", icon: <IconMailOff /> },
  sent: { variant: "info", icon: <IconMailForward /> },
  responded: { variant: "success", icon: <IconMailCheck /> },
  overdue: { variant: "destructive", icon: <IconAlertTriangle /> },
};

export function RenewalNoticeBadge({ status }: { status: RenewalNoticeStatus }) {
  const { variant, icon } = NOTICE_CONFIG[status];
  return (
    <Badge variant={variant} icon={icon}>
      {RENEWAL_NOTICE_LABEL[status]}
    </Badge>
  );
}
