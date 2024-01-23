--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: resourcehistories_action_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.resourcehistories_action_enum AS ENUM (
    'Created',
    'Deleted'
);


ALTER TYPE public.resourcehistories_action_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AAA_Department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AAA_Department" (
    "afterActionAnalysisId" uuid NOT NULL,
    "departmentId" uuid NOT NULL
);


ALTER TABLE public."AAA_Department" OWNER TO postgres;

--
-- Name: actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    action character varying NOT NULL,
    "responsiblePersonId" uuid,
    "authorizedPersonId" uuid,
    "afterActionAnalysisId" uuid
);


ALTER TABLE public.actions OWNER TO postgres;

--
-- Name: afterActionAnalysis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."afterActionAnalysis" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    title character varying NOT NULL,
    description text NOT NULL,
    "teamInvolves" character varying,
    "rootCause" text NOT NULL,
    "lessonLearned" text NOT NULL,
    remarks text NOT NULL,
    "projectId" uuid
);


ALTER TABLE public."afterActionAnalysis" OWNER TO postgres;

--
-- Name: after_action_analysis_issue_related; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.after_action_analysis_issue_related (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying
);


ALTER TABLE public.after_action_analysis_issue_related OWNER TO postgres;

--
-- Name: approval_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_level (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "levelName" character varying NOT NULL,
    count integer NOT NULL,
    "isMultiple" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.approval_level OWNER TO postgres;

--
-- Name: approval_module; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_module (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "moduleName" character varying NOT NULL,
    max_level integer
);


ALTER TABLE public.approval_module OWNER TO postgres;

--
-- Name: approval_stage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_stage (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    level integer NOT NULL,
    "roleId" uuid,
    "approvalModuleId" uuid,
    project_role boolean DEFAULT false NOT NULL
);


ALTER TABLE public.approval_stage OWNER TO postgres;

--
-- Name: baseline_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.baseline_comment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    comment character varying NOT NULL,
    "baselineId" uuid NOT NULL,
    "userId" uuid
);


ALTER TABLE public.baseline_comment OWNER TO postgres;

--
-- Name: baselines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.baselines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    name character varying NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "projectId" uuid NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    rejected boolean DEFAULT false NOT NULL,
    "approvalStageId" uuid
);


ALTER TABLE public.baselines OWNER TO postgres;

--
-- Name: budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    description text NOT NULL,
    amount double precision NOT NULL,
    "groupId" uuid,
    "taskId" uuid,
    "budgetCategoryId" uuid,
    "taskCategoryId" uuid,
    "projectId" uuid,
    "currencyId" character varying
);


ALTER TABLE public.budget OWNER TO postgres;

--
-- Name: budgetGroupComment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."budgetGroupComment" (
    "budgetGroupId" uuid NOT NULL,
    "budgetCommentId" uuid NOT NULL
);


ALTER TABLE public."budgetGroupComment" OWNER TO postgres;

--
-- Name: budget_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_category (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "budgetCategoryName" character varying NOT NULL,
    "accountNumber" character varying NOT NULL
);


ALTER TABLE public.budget_category OWNER TO postgres;

--
-- Name: budget_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_comment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "budgetComment" text NOT NULL
);


ALTER TABLE public.budget_comment OWNER TO postgres;

--
-- Name: budget_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_group (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "from" date NOT NULL,
    "to" date NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    rejected boolean DEFAULT false NOT NULL,
    "approvalStageId" uuid,
    "projectId" uuid
);


ALTER TABLE public.budget_group OWNER TO postgres;

--
-- Name: budget_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "isActive" boolean NOT NULL
);


ALTER TABLE public.budget_sessions OWNER TO postgres;

--
-- Name: budget_task_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_task_category (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "budgetTaskCategoryName" character varying NOT NULL,
    "accountNumber" character varying NOT NULL,
    "budgetTypeId" uuid
);


ALTER TABLE public.budget_task_category OWNER TO postgres;

--
-- Name: budget_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_type (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "budgetTypeName" character varying NOT NULL
);


ALTER TABLE public.budget_type OWNER TO postgres;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "clientName" character varying NOT NULL,
    "postalCode" character varying,
    address character varying,
    telephone character varying NOT NULL,
    isdeleted smallint NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency (
    name character varying,
    code character varying,
    symbol character varying,
    active character varying,
    created_at character varying,
    updated_at character varying,
    id character varying NOT NULL,
    format character varying,
    exchange_rate numeric
);


ALTER TABLE public.currency OWNER TO postgres;

--
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "departmentName" character varying NOT NULL,
    abbrivation character varying NOT NULL,
    "departmentProductManager" uuid,
    "idDeleted" boolean NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


ALTER TABLE public.department OWNER TO postgres;

--
-- Name: individualLL; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."individualLL" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "LLOwnerName" character varying NOT NULL,
    "LLOwnerId" character varying NOT NULL,
    problem text NOT NULL,
    impact text NOT NULL,
    "lessonLearnedText" text NOT NULL,
    "lessonLearnedId" uuid
);


ALTER TABLE public."individualLL" OWNER TO postgres;

--
-- Name: issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issues (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "riskDescription" text NOT NULL,
    "causedBy" character varying NOT NULL,
    consequences character varying NOT NULL,
    "riskOwner" character varying NOT NULL,
    status character varying NOT NULL,
    impact character varying NOT NULL,
    control character varying NOT NULL,
    "controlOwner" character varying NOT NULL,
    "residualImpact" character varying NOT NULL,
    "projectId" uuid
);


ALTER TABLE public.issues OWNER TO postgres;

--
-- Name: lessonLearned; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."lessonLearned" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    name character varying NOT NULL,
    "PMOMName" character varying NOT NULL,
    "PMOMId" character varying NOT NULL,
    "PMName" character varying NOT NULL,
    "PMId" character varying NOT NULL,
    date character varying NOT NULL,
    status character varying NOT NULL,
    "projectId" uuid,
    "departmentId" uuid
);


ALTER TABLE public."lessonLearned" OWNER TO postgres;

--
-- Name: llComments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."llComments" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "userId" uuid NOT NULL,
    comment text NOT NULL,
    "lessonLearnedId" uuid,
    date character varying NOT NULL
);


ALTER TABLE public."llComments" OWNER TO postgres;

--
-- Name: milestones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.milestones (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    name character varying NOT NULL,
    status boolean DEFAULT true NOT NULL,
    weight integer,
    "projectId" uuid NOT NULL,
    "paymentTermId" uuid
);


ALTER TABLE public.milestones OWNER TO postgres;

--
-- Name: minute_of_meetings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.minute_of_meetings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    title character varying NOT NULL,
    "meetingDate" date,
    "meetingTime" character varying,
    location character varying,
    "facilitatorId" uuid,
    objective character varying,
    "specialNote" character varying,
    "externalAttendees" json,
    "projectId" uuid NOT NULL
);


ALTER TABLE public.minute_of_meetings OWNER TO postgres;

--
-- Name: mom_action_responsible; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mom_action_responsible (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "momActionId" uuid NOT NULL
);


ALTER TABLE public.mom_action_responsible OWNER TO postgres;

--
-- Name: mom_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mom_actions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    action character varying,
    deadline character varying,
    "momId" uuid
);


ALTER TABLE public.mom_actions OWNER TO postgres;

--
-- Name: mom_agenda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mom_agenda (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    agenda character varying NOT NULL,
    "momId" uuid NOT NULL
);


ALTER TABLE public.mom_agenda OWNER TO postgres;

--
-- Name: mom_agenda_topic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mom_agenda_topic (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "agendaPoints" character varying NOT NULL,
    "userId" uuid,
    "otherUser" character varying,
    "agendaId" uuid NOT NULL
);


ALTER TABLE public.mom_agenda_topic OWNER TO postgres;

--
-- Name: mom_attendees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mom_attendees (
    "userId" uuid NOT NULL,
    "momId" uuid NOT NULL
);


ALTER TABLE public.mom_attendees OWNER TO postgres;

--
-- Name: mom_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mom_comment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    comment character varying NOT NULL,
    "momId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.mom_comment OWNER TO postgres;

--
-- Name: monthly_budget_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monthly_budget_comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "budgetComment" text NOT NULL,
    "userId" text,
    "monthlyBudgetId" uuid
);


ALTER TABLE public.monthly_budget_comments OWNER TO postgres;

--
-- Name: monthly_budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monthly_budgets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "budgetsData" json NOT NULL,
    "from" date NOT NULL,
    "to" date NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    rejected boolean DEFAULT false NOT NULL,
    "approvalStageId" uuid
);


ALTER TABLE public.monthly_budgets OWNER TO postgres;

--
-- Name: payment_term; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_term (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    name character varying NOT NULL,
    amount double precision NOT NULL,
    "plannedCollectionDate" date,
    "actualCollectionDate" date,
    status boolean DEFAULT true NOT NULL,
    "projectId" uuid NOT NULL,
    "currencyId" character varying,
    "isOffshore" boolean NOT NULL,
    "isAmountPercent" boolean DEFAULT false NOT NULL,
    "budgetTypeId" uuid
);


ALTER TABLE public.payment_term OWNER TO postgres;

--
-- Name: project_contract_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_contract_values (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    amount integer,
    "projectId" uuid,
    "currencyId" character varying
);


ALTER TABLE public.project_contract_values OWNER TO postgres;

--
-- Name: project_member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_member (
    "userId" uuid NOT NULL,
    "projectId" uuid NOT NULL,
    "roleId" uuid
);


ALTER TABLE public.project_member OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    name character varying NOT NULL,
    "clientId" uuid,
    milestone integer,
    budget integer,
    contract_sign_date date,
    planned_end_date date,
    lc_opening_date date,
    advanced_payment_date date,
    status boolean,
    "isOffice" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: relatedissues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.relatedissues (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    name character varying NOT NULL,
    "afterActionAnalysisId" uuid
);


ALTER TABLE public.relatedissues OWNER TO postgres;

--
-- Name: resourcehistories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resourcehistories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "Action" public.resourcehistories_action_enum,
    "projectId" uuid,
    "taskId" uuid,
    "userId" uuid
);


ALTER TABLE public.resourcehistories OWNER TO postgres;

--
-- Name: risks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "riskDescription" text NOT NULL,
    "causedBy" character varying NOT NULL,
    consequences character varying NOT NULL,
    "riskOwner" character varying NOT NULL,
    status character varying NOT NULL,
    "controlOwner" character varying NOT NULL,
    control character varying NOT NULL,
    probability character varying NOT NULL,
    impact character varying NOT NULL,
    "riskRate" character varying,
    "residualProbability" character varying NOT NULL,
    "residualImpact" character varying NOT NULL,
    "residualRiskRate" character varying,
    "projectId" uuid
);


ALTER TABLE public.risks OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    "roleName" character varying NOT NULL,
    "isProjectRole" boolean NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: subtasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subtasks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    name character varying NOT NULL,
    "plannedStart" date,
    "plannedFinish" date,
    "actualStart" date,
    "actualFinish" date,
    completion integer,
    "plannedCost" integer,
    "actualCost" integer,
    status boolean,
    "sleepingReason" character varying,
    "taskId" uuid NOT NULL,
    predecessor character varying
);


ALTER TABLE public.subtasks OWNER TO postgres;

--
-- Name: taskUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."taskUser" (
    "taskId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public."taskUser" OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    name character varying NOT NULL,
    "plannedStart" date NOT NULL,
    "plannedFinish" date NOT NULL,
    "actualStart" date,
    "actualFinish" date,
    completion integer,
    "plannedCost" integer,
    "actualCost" integer,
    status boolean,
    "sleepingReason" character varying,
    "baselineId" uuid NOT NULL,
    "milestoneId" uuid NOT NULL,
    predecessor character varying
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    "emailVerifiedAt" timestamp without time zone,
    password character varying,
    avatar character varying,
    signature character varying,
    "isDeleted" boolean,
    "rememberToken" text,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL,
    "roleId" uuid
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: weekly_report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_report (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    year integer NOT NULL,
    month integer NOT NULL,
    week integer NOT NULL,
    "sleepingTasks" json,
    "nextWeekTasks" json,
    risks json,
    issues json,
    "overAllProgress" json,
    "isApproved" boolean DEFAULT false NOT NULL,
    "projectId" uuid NOT NULL
);


ALTER TABLE public.weekly_report OWNER TO postgres;

--
-- Name: weekly_report_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_report_comment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdBy" character varying,
    "updatedBy" character varying,
    comment character varying NOT NULL,
    "weeklyReportId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.weekly_report_comment OWNER TO postgres;

--
-- Data for Name: AAA_Department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AAA_Department" ("afterActionAnalysisId", "departmentId") FROM stdin;
f98bbab7-8f78-4232-a3c4-b7ce6737143c	afecd91c-8a2d-430d-b1a6-16f71388e006
f98bbab7-8f78-4232-a3c4-b7ce6737143c	7b58e14d-ac58-46aa-8835-384fa6e3fed1
27c92474-bc41-480d-8974-d2ebb3a431ea	94f27c61-1396-4a3b-8267-aaf61a4ef0f6
37345c48-5d69-492d-a5df-e92c73db3743	13d0b1c2-9add-43d9-9e81-006aef68b7ac
b19127c5-0b11-4cb2-9b29-c1f6c379dc3f	6434d36c-7c76-4fe3-a64c-31895e0ffd96
7a7034dc-6d7a-4873-ac23-9c356aa7d4e0	afecd91c-8a2d-430d-b1a6-16f71388e006
\.


--
-- Data for Name: actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actions (id, "createdAt", "updatedAt", "createdBy", "updatedBy", action, "responsiblePersonId", "authorizedPersonId", "afterActionAnalysisId") FROM stdin;
54881983-bd86-4dfb-acce-bcea5b55ee47	2023-09-15 07:53:15.430012	2023-09-15 07:53:15.430012	\N	\N	ksjdfkjvkjsdnfkv	124e10bd-5a64-4b3a-8f07-c7469b956ca4	0ac4cfcf-a3f4-4f91-b3e3-e23b192760d7	f98bbab7-8f78-4232-a3c4-b7ce6737143c
3a4ebc7a-a0e1-43af-9c86-54e2ef72f837	2023-09-15 07:53:53.746656	2023-09-15 07:53:53.746656	\N	\N	daksdkcbhkajsdkc	08a56d82-2c87-45f1-8027-af5b2f2e0688	5d96355d-16a6-43bb-a4fa-4dcb2e219be4	f98bbab7-8f78-4232-a3c4-b7ce6737143c
c69c79d1-c007-48d0-9129-e65c293d30a1	2023-09-15 07:53:53.746656	2023-09-15 07:53:53.746656	\N	\N	aisdcknaksjdnck	46018fe7-9058-4f93-a556-60f06fb6a3a0	78792873-88f2-4a92-9696-3be4271702b1	f98bbab7-8f78-4232-a3c4-b7ce6737143c
aa40a372-0116-4c5e-b97e-5528e03beeda	2023-10-17 15:18:44.719878	2023-10-17 15:18:44.719878	\N	\N	test	\N	\N	\N
3f7f8823-ed83-40e8-825e-0f1b1f8d1d4a	2023-09-15 10:17:35.545115	2023-09-15 10:17:35.545115	\N	\N	repremand	2dde543e-d99e-4bc9-bf0d-8cef84d4dcc1	5a53895e-a8c8-49f7-a353-780b3ab2209d	\N
a6865d63-9499-4f33-8e22-e9cbd37d323d	2023-11-01 16:06:01.245734	2023-11-01 16:06:01.245734	\N	\N	klasdsjflkj	00592b61-4639-4eba-a374-766147ce5c0f	0c738c29-a170-4153-8bd2-363b6cfbfda2	37345c48-5d69-492d-a5df-e92c73db3743
b7625909-b0de-4763-bb26-dd0960891766	2023-11-01 16:36:43.076967	2023-11-01 16:36:43.076967	\N	\N	l;sdakjlfkj	00592b61-4639-4eba-a374-766147ce5c0f	00bf1d57-8760-471d-8602-615abd7cd977	b19127c5-0b11-4cb2-9b29-c1f6c379dc3f
\.


--
-- Data for Name: afterActionAnalysis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."afterActionAnalysis" (id, "createdAt", "updatedAt", "createdBy", "updatedBy", title, description, "teamInvolves", "rootCause", "lessonLearned", remarks, "projectId") FROM stdin;
f98bbab7-8f78-4232-a3c4-b7ce6737143c	2023-09-15 07:52:57.521032	2023-09-15 07:52:57.521032	\N	\N	title	kzjsdckjnaksd	\N	&lt;p>root&lt;/p>	&lt;p>lesson&lt;/p>	&lt;p>remark&lt;/p>	889bd689-643d-45a7-af6f-289045e35321
27c92474-bc41-480d-8974-d2ebb3a431ea	2023-10-17 15:30:38.020816	2023-10-17 15:30:38.020816	\N	\N	test2	test3	\N	&lt;p>test&lt;/p>	&lt;p>test &lt;/p>	&lt;p>&lt;p&gt;test&lt;/p&gt;&lt;/p>	21351d69-2f54-451e-978c-c487dc43cc59
37345c48-5d69-492d-a5df-e92c73db3743	2023-11-01 16:05:10.457724	2023-11-01 16:05:10.457724	\N	\N	asdklfjlk	klajsdlkfj	\N	askldjflk	lkajsdlkfjlk	kaldsjflkjlksjdlkfjlk	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
b19127c5-0b11-4cb2-9b29-c1f6c379dc3f	2023-11-01 16:36:27.18383	2023-11-01 16:36:27.18383	\N	\N	New AAA	Issue 	\N	kjdsajfkljklasdjf	asdfasdf	asddfasd	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
7a7034dc-6d7a-4873-ac23-9c356aa7d4e0	2023-12-04 15:54:49.589686	2023-12-04 15:54:49.589686	\N	\N	New AAA	Issue	\N	New Root Cause	Finalize update	Remark	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
\.


--
-- Data for Name: after_action_analysis_issue_related; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.after_action_analysis_issue_related (id, "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: approval_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_level (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "levelName", count, "isMultiple") FROM stdin;
b9b82685-38c5-4cd3-a2bf-6b32a45867d6	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	One Level	1	f
d619d39f-c981-4e5f-a17b-47b900fc6a7e	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	Two Levels	2	f
7097ee3d-17f3-4bd1-83a3-ea68cf628740	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	Three Levels	3	f
f8c39bfd-6008-4a6a-9852-a1b74727b4a9	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	Four Levels	4	f
4d441a1a-474c-4ff5-a4aa-d671ee2c5e3e	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	Five Levels	5	f
8e742bce-fae9-49ea-b7ff-6c053f414947	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	Six Levels	6	f
b9c281a5-5c3a-4423-a3ec-b1703480be3b	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	Seven Levels	7	f
2e2e26fa-b28e-4cb2-a046-ea5f59730901	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	Eight Levels	8	f
5c1c6c8a-0521-479a-87a6-168f472c1969	2023-08-30 15:29:02.332657	2023-08-30 15:29:02.332657	\N	\N	Nine Level	9	f
\.


--
-- Data for Name: approval_module; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_module (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "moduleName", max_level) FROM stdin;
cb94d965-8ad5-455f-85e5-7043d2d57f9a	2023-11-30 10:48:21.532037	2023-11-30 10:48:21.532037	\N	\N	OfficeProjectBudget	2
76bffce2-e9f2-42be-9f2c-a5abd659c989	2023-11-30 10:48:21.532037	2023-11-30 10:48:21.532037	\N	\N	ProjectSchedule	3
90fc8da5-3370-4cbd-af50-5cc1d8307c7c	2023-11-30 10:48:21.532037	2023-11-30 10:48:21.532037	\N	\N	MonthlyBudget	2
ff552ed9-55bd-47e8-93db-31be7bda80ff	2023-11-30 10:48:21.532037	2023-11-30 10:48:21.532037	\N	\N	ProjectBudget	1
\.


--
-- Data for Name: approval_stage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_stage (id, "createdAt", "updatedAt", "createdBy", "updatedBy", level, "roleId", "approvalModuleId", project_role) FROM stdin;
542e3a0f-d911-453a-bf48-d49d6e6563ec	2023-11-30 11:32:47.418597	2023-11-30 11:32:47.418597	\N	\N	1	4eafb2fd-e9e4-40d0-8c87-a2a2b9c48c5f	ff552ed9-55bd-47e8-93db-31be7bda80ff	f
2583c421-b21e-48fa-88d6-977e9d65ee25	2023-11-30 11:40:28.35717	2023-11-30 11:40:28.35717	\N	\N	1	0e324e94-6f2c-415c-9a46-a359a96fea7f	90fc8da5-3370-4cbd-af50-5cc1d8307c7c	f
c51434ea-fda4-4d00-80b7-b931f960ecaf	2023-11-30 11:40:28.35717	2023-11-30 11:40:28.35717	\N	\N	2	66d7bce9-c323-4fdc-906e-77f9c4b2edd0	90fc8da5-3370-4cbd-af50-5cc1d8307c7c	f
300b3cde-eeb5-499a-9e51-d953363364e8	2023-11-30 11:51:59.066156	2023-11-30 11:51:59.066156	\N	\N	1	5dbeddaf-3490-4151-9e80-303c70f18a10	76bffce2-e9f2-42be-9f2c-a5abd659c989	t
be923e56-33b7-4868-85b1-08c7dda419e1	2023-11-30 11:51:59.066156	2023-11-30 11:51:59.066156	\N	\N	2	4eafb2fd-e9e4-40d0-8c87-a2a2b9c48c5f	76bffce2-e9f2-42be-9f2c-a5abd659c989	f
c42d5ca0-ac35-4ca5-b559-b53a878d4c96	2023-11-30 11:51:59.066156	2023-11-30 11:51:59.066156	\N	\N	2	962fbf27-01c7-4b77-80f7-aa2f39936c8d	76bffce2-e9f2-42be-9f2c-a5abd659c989	f
\.


--
-- Data for Name: baseline_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.baseline_comment (id, "createdAt", "updatedAt", "createdBy", "updatedBy", comment, "baselineId", "userId") FROM stdin;
\.


--
-- Data for Name: baselines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.baselines (id, "createdAt", "updatedAt", "createdBy", "updatedBy", name, status, "projectId", approved, rejected, "approvalStageId") FROM stdin;
334d1dfd-3fee-49e1-ba20-1a7e3ecc5c87	2023-12-04 12:08:02.062483	2023-12-04 12:08:02.062483	\N	\N	baseline 1	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	f	f	\N
8249baf7-d96c-414d-b770-7ca8a5e9a836	2023-12-04 14:39:05.546863	2023-12-04 14:39:05.546863	\N	\N	base one	t	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	f	f	300b3cde-eeb5-499a-9e51-d953363364e8
7e908b6a-27f5-4c38-9ec0-6b123943d081	2023-11-30 11:54:14.70915	2023-11-30 11:54:14.70915	\N	\N	nnnn	t	b121be11-cbcc-41b0-89e4-8e4a289d04b0	f	f	300b3cde-eeb5-499a-9e51-d953363364e8
\.


--
-- Data for Name: budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget (id, "createdAt", "updatedAt", "createdBy", "updatedBy", description, amount, "groupId", "taskId", "budgetCategoryId", "taskCategoryId", "projectId", "currencyId") FROM stdin;
8e696593-7388-4018-8533-0d85e2f19c86	2023-11-30 11:54:58.657465	2023-11-30 11:54:58.657465	\N	\N	nnnn	9999	01c95c52-8359-44b5-a13d-10c1399af2bb	6c34db3c-cba4-4b41-bbf7-46e2b5490b14	31986f0c-664a-4f2f-913a-413d76c2dcda	46f89e6a-37f9-4668-b89d-9a265b93ca20	b121be11-cbcc-41b0-89e4-8e4a289d04b0	2
e9dd4990-efab-4b3c-80fd-ff7a10212c81	2023-11-30 11:54:58.657465	2023-11-30 11:54:58.657465	\N	\N	nnn	99	01c95c52-8359-44b5-a13d-10c1399af2bb	29f928df-bc64-45ba-8080-b6589271536a	5d0ed75e-ee04-46f0-bbdb-eb5f71cb1c4a	a094e25c-4fcb-4751-80f3-dabcc53d5415	b121be11-cbcc-41b0-89e4-8e4a289d04b0	4
0427d6b6-9676-46da-aafa-b74d1f07834c	2023-12-04 12:44:35.731311	2023-12-04 12:44:35.731311	\N	\N	jkashuiaeu	3000	a294c70f-3c51-4297-bf98-2e7bb7e82ffd	eca5f79b-3f94-43df-b066-52ac5c1b6a2e	31986f0c-664a-4f2f-913a-413d76c2dcda	46f89e6a-37f9-4668-b89d-9a265b93ca20	168da302-8bf6-4b1d-8126-e329fbf1b2e9	2
5ec53104-1cad-4c5a-9cff-a1df8321d075	2023-12-04 12:44:35.731311	2023-12-04 12:44:35.731311	\N	\N	akjshfu	3022	a294c70f-3c51-4297-bf98-2e7bb7e82ffd	a5db711d-322a-44d6-8e47-322326397d7a	5d0ed75e-ee04-46f0-bbdb-eb5f71cb1c4a	a094e25c-4fcb-4751-80f3-dabcc53d5415	168da302-8bf6-4b1d-8126-e329fbf1b2e9	4
77184c7b-0677-4a98-a35d-e7b38ee471cd	2023-12-04 12:51:58.244445	2023-12-04 12:51:58.244445	\N	\N	jhldsjkahsd	2000	733b8b79-3f0f-4065-aa5d-ecc836907cfb	eca5f79b-3f94-43df-b066-52ac5c1b6a2e	31986f0c-664a-4f2f-913a-413d76c2dcda	a094e25c-4fcb-4751-80f3-dabcc53d5415	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1
c64a8f0f-6de5-4c4b-9a22-30170089f48d	2023-12-04 12:51:58.244445	2023-12-04 12:51:58.244445	\N	\N	jsahjkals	3000	733b8b79-3f0f-4065-aa5d-ecc836907cfb	a5db711d-322a-44d6-8e47-322326397d7a	5d0ed75e-ee04-46f0-bbdb-eb5f71cb1c4a	46f89e6a-37f9-4668-b89d-9a265b93ca20	168da302-8bf6-4b1d-8126-e329fbf1b2e9	2
04cc5f48-172b-496d-842f-a5bc76079cc1	2023-12-04 15:21:52.603425	2023-12-04 15:21:52.603425	\N	\N	labor	100	41dc165f-b5ff-444a-a6c7-d4a48ca938be	846f3664-b597-4b9e-b6aa-c057fbe0dceb	5d0ed75e-ee04-46f0-bbdb-eb5f71cb1c4a	46f89e6a-37f9-4668-b89d-9a265b93ca20	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	7
\.


--
-- Data for Name: budgetGroupComment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."budgetGroupComment" ("budgetGroupId", "budgetCommentId") FROM stdin;
01c95c52-8359-44b5-a13d-10c1399af2bb	6115a5a1-0b17-44e9-963d-5a4b833b995a
\.


--
-- Data for Name: budget_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_category (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "budgetCategoryName", "accountNumber") FROM stdin;
5d0ed75e-ee04-46f0-bbdb-eb5f71cb1c4a	2023-08-29 15:48:34.843243	2023-08-29 15:48:34.843243	\N	\N	Cost	5100
31986f0c-664a-4f2f-913a-413d76c2dcda	2023-09-04 11:03:35.394605	2023-09-04 11:03:35.394605	\N	\N	expense	6100
\.


--
-- Data for Name: budget_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_comment (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "budgetComment") FROM stdin;
6115a5a1-0b17-44e9-963d-5a4b833b995a	2023-11-30 12:07:16.93999	2023-11-30 12:07:16.93999	\N	\N	nnnnnnnnnnnnnnnnn
\.


--
-- Data for Name: budget_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_group (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "from", "to", approved, rejected, "approvalStageId", "projectId") FROM stdin;
01c95c52-8359-44b5-a13d-10c1399af2bb	2023-11-30 11:54:58.595453	2023-11-30 11:54:58.595453	\N	\N	2023-11-01	2023-12-01	f	t	542e3a0f-d911-453a-bf48-d49d6e6563ec	b121be11-cbcc-41b0-89e4-8e4a289d04b0
a294c70f-3c51-4297-bf98-2e7bb7e82ffd	2023-12-04 12:44:35.685662	2023-12-04 12:44:35.685662	\N	\N	2023-12-01	2023-12-30	t	f	542e3a0f-d911-453a-bf48-d49d6e6563ec	168da302-8bf6-4b1d-8126-e329fbf1b2e9
733b8b79-3f0f-4065-aa5d-ecc836907cfb	2023-12-04 12:51:58.200736	2023-12-04 12:51:58.200736	\N	\N	2024-01-01	2024-01-30	t	f	542e3a0f-d911-453a-bf48-d49d6e6563ec	168da302-8bf6-4b1d-8126-e329fbf1b2e9
41dc165f-b5ff-444a-a6c7-d4a48ca938be	2023-12-04 15:21:52.566833	2023-12-04 15:21:52.566833	\N	\N	2024-01-01	2024-01-30	t	f	542e3a0f-d911-453a-bf48-d49d6e6563ec	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
\.


--
-- Data for Name: budget_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_sessions (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "startDate", "endDate", "isActive") FROM stdin;
779a34b1-65ec-43c7-94b0-8361f89debdd	2023-11-30 09:18:38.976	2023-11-30 09:18:38.976	\N	\N	2023-11-30	2023-12-12	f
9404932a-dd5a-4931-af7f-b86e24e1c235	2023-11-30 09:20:59.987	2023-11-30 09:20:59.987	\N	\N	2023-11-01	2023-12-01	f
fa3ccbff-546e-450a-a6e2-afb98a8a37dc	2023-12-04 12:43:25.158	2023-12-04 12:43:25.158	\N	\N	2023-12-01	2023-12-30	f
e60be4a2-a65d-4759-a3fd-fcac711d7151	2023-12-04 12:50:49.095	2023-12-04 12:50:49.095	\N	\N	2024-01-01	2023-12-30	f
31cbde41-df73-4e29-8c34-7b1bb2c7d7d8	2023-12-04 12:51:17.188337	2023-12-04 12:51:17.188337	\N	\N	2024-01-01	2024-01-30	t
\.


--
-- Data for Name: budget_task_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_task_category (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "budgetTaskCategoryName", "accountNumber", "budgetTypeId") FROM stdin;
a094e25c-4fcb-4751-80f3-dabcc53d5415	2023-09-01 17:07:20.831488	2023-09-01 17:07:20.831488	\N	\N	Material	67890	1c543947-80cd-458a-a829-6c703b012f63
46f89e6a-37f9-4668-b89d-9a265b93ca20	2023-08-29 15:49:25.441981	2023-08-29 15:49:25.441981	\N	\N	Labor	12345	1c543947-80cd-458a-a829-6c703b012f63
\.


--
-- Data for Name: budget_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_type (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "budgetTypeName") FROM stdin;
1c543947-80cd-458a-a829-6c703b012f63	2023-08-29 15:48:51.448778	2023-08-29 15:48:51.448778	\N	\N	Service
a93de03c-82bd-4811-b630-afe737b02074	2023-09-04 11:02:46.236742	2023-09-04 11:02:46.236742	\N	\N	product
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, "clientName", "postalCode", address, telephone, isdeleted, "createdAt", "updatedAt", "createdBy", "updatedBy") FROM stdin;
012bdd24-3286-4670-9b82-70f6ef664b25	Ethiopian statistics service	1143	Addis Ababa	+251111564226	0	2022-10-28 09:35:40	2022-11-08 14:58:01	\N	\N
17b991a5-664f-4034-adbe-141451fbb3bc	ASTU	3000	Addis Ababa	+251931988789	0	2022-10-24 03:04:41	2022-10-24 03:04:41	\N	\N
1fb61f8e-f9dc-4405-8d38-c9e11ed6b1e1	Ministry of Innovation and Technology	2490	Addis Ababa	0911446582	1	2022-10-25 11:14:06	2022-10-25 11:16:14	\N	\N
285c68de-bb2e-4376-abaa-5da2f8fc5f40	Ethiopian Shipping and Logistic Service Enterprise	\N	Addis Ababa, sub city Kirkos, woreda 07	251115514097	0	2022-11-05 20:35:06	2022-11-05 20:35:06	\N	\N
32c5766d-4a72-42ea-be38-9a5d15d2717d	AMU	4996033974	Areba minch	4996033974	0	2022-11-11 13:25:27	2022-11-11 13:25:27	\N	\N
333619e1-e803-470a-afaa-c4179d9a8ef0	Industrial Parks Development Corporation	2458	Yeka sub-City, Woreda 07, House No., IPDC Building	0116616396	0	2022-10-27 06:23:35	2022-10-27 06:23:35	\N	\N
3663f5ba-13d5-4f4a-a5b0-f13f2b25bc6c	Siinqee Bank	\N	Kazanchis, Odaa Tower Addis Ababa ,Ethiopia	+251911535740	0	2022-11-08 13:02:03	2022-11-08 13:02:03	\N	\N
3a3e1acf-6bf2-418b-ae02-5880241d9240	Ministry of Finance	1245	Addis Ababa	0912260321	0	2023-05-29 13:15:18	2023-05-29 13:15:18	\N	\N
3b2e7460-dbcb-4d1c-9d60-a5c2e6b767e7	Nokia	\N	Bole A.A	+971566853888	0	2022-12-28 16:34:10	2022-12-28 16:34:10	\N	\N
3daa58fe-a3a7-4468-a87b-8587275ffa19	Yonas	2121	a.a	0911420876	0	2023-05-20 03:22:02	2023-05-20 03:22:02	\N	\N
3ff0ec33-a931-42ba-89a2-61d1eb7b1576	Nokia	\N	\N	+91 7290020676	0	2022-12-28 16:47:14	2022-12-28 16:47:14	\N	\N
45567df4-20fb-4dbc-9cdf-d8aaab9959e4	Ethswitch S.c	124563	Kazanchis	0911252326	1	2022-11-16 15:23:50	2022-11-16 15:27:05	\N	\N
45db3f62-00cb-4406-a1c4-872d8c9de059	IE Networks Solutions PLC	122521	Festival 22 Infront of Awraris Hotel	251-115570544	0	2022-12-08 20:14:26	2023-06-09 13:51:15	\N	\N
5aaaaf1f-8740-4d83-8031-e32bcfeb7ff7	jimma university	6040	Jimma	+251 47 111 84 00	0	2022-11-11 22:39:41	2022-11-11 22:39:41	\N	\N
5c3ad833-1e68-42fb-96fe-496b8436200e	Nokia	\N	Bole A.A	+971566853888	0	2022-12-28 16:34:10	2022-12-28 16:34:10	\N	\N
61309675-8948-4a65-a308-27682837f4c7	Bahirdar University	79	Bahirdar, Ethiopia	0583206015	0	2022-10-25 05:18:26	2022-10-25 11:16:23	\N	\N
73cadb0b-b055-4711-a59b-3a3eb526c678	Synergy Corp.Consulting	1000	Addis Ababa	0913645440	0	2023-01-04 13:06:43	2023-01-04 13:06:43	\N	\N
7da79617-2dc5-4bd3-9afe-f5203b3c35cb	Ethiopian Shipping and Logistic Service Enterprise	\N	Addis Ababa, sub city Kirkos, woreda 07	251115514097	0	2022-11-05 20:35:06	2022-11-05 20:35:06	\N	\N
860bc14d-4094-4d97-b835-65393306cf1c	Bunna Bank	12345	Arat kilo	0940392834	0	2023-03-09 14:45:26	2023-03-09 14:45:26	\N	\N
92799e0a-9973-4f98-b8b3-ff764acd1ae0	Africa Union Commission	3243	Roosevelt Street W21K19, Addis Ababa, Ethiopia	+251115517844	0	2022-11-07 02:32:28	2022-11-07 02:32:28	\N	\N
9cee6fa0-45ff-4ef2-9b44-9fa6befd5eaa	EOTC	\N	Mexico Wabeshebbele	251-911481031	0	2023-05-23 21:14:23	2023-05-23 21:14:23	\N	\N
b4607ded-2a6c-49ca-bcab-ac7b32cabb9d	Nokia	\N	Bole A.A	+971566853888	0	2022-12-28 16:34:10	2022-12-28 16:34:10	\N	\N
b612e9a8-4da3-474c-a9a3-a48a53272a48	Ministry of Innovation and Technology	2490	Addis Ababa	0911446582	1	2022-10-25 11:11:45	2022-10-25 11:16:34	\N	\N
b7d17d64-6b56-4300-9c3a-6e7b84d740d0	JU	1234	Jimma	25194723457	0	2023-02-25 16:50:33	2023-02-25 16:50:33	\N	\N
bba83a36-e453-4bf0-aa05-5dbc0a432e29	Test	100	aa	0908353430	1	2023-01-10 13:52:51	2023-01-10 13:53:51	\N	\N
be6c29ab-de8d-48d4-ad1a-400c098523b1	Ethiopian pharmaceuticals supply agency	480	Addis Ababa	011-27-51770	0	2023-02-07 22:46:53	2023-02-07 22:46:53	\N	\N
c0f85caf-80c1-40f7-b1fc-9e3f86688575	Dire Dawa University	1362	Dire Dawa	251251111501	0	2022-12-14 13:00:30	2022-12-14 13:00:30	\N	\N
c2676c91-67e5-4209-8d74-0a4dc7266977	Ethiopian Pharmaceuticals Supply Agency	21904	Addis Abeba	0112751770	0	2022-12-14 12:59:11	2022-12-14 12:59:11	\N	\N
c54431f2-f28b-46e9-b55e-dfc7b0663c2e	Ministry of Innovation and Technology	2490	Addis Ababa	0911446582	0	2022-10-25 11:15:47	2022-10-25 11:15:47	\N	\N
cbc54837-80ba-4d9b-a42b-79e11d4f8c28	Bahirdar University	79	Bahirdar, Ethiopia	0583206015	0	2022-11-11 15:19:36	2022-11-11 15:19:36	\N	\N
cc833ed4-a899-4ff0-b0af-3e7ea2b31473	Nokia	\N	Bole A.A	+971566853888	0	2022-12-28 16:34:10	2022-12-28 16:34:10	\N	\N
cd9b4bbb-767f-4541-8e07-157ff8f2eb6b	Ministry of Trade and Regional Integration Ethiopia	1143	Bole 12/13	+251915574020	0	2022-10-28 11:32:50	2022-10-28 11:32:50	\N	\N
cdbdd369-8240-4807-bf95-720f6532035a	Office of Auditor	32145	Filamingo	+251653962	0	2023-04-26 20:00:04	2023-04-26 20:00:04	\N	\N
ce7c1e45-694f-444e-8e28-73fcf88889c5	Ethiopian News Agency	30231	Addis Ababa	0912324256	0	2023-05-03 23:26:40	2023-05-03 23:26:40	\N	\N
eb44934d-7950-4cd2-9feb-246c39a9afd8	Nokia	\N	Bole A.A	+971566853888	0	2022-12-28 16:34:10	2022-12-28 16:34:10	\N	\N
f0ba3f9d-205b-4385-a791-33d0627efff5	Commercial Bank of Ethiopia	255	Gambia Street	+251 115515004	0	2022-11-05 20:07:34	2022-11-05 20:07:34	\N	\N
f4422e25-2085-42b8-b621-fd512cef2bd2	Ethiopian Commodity Exchange	NA	Addis Ababa	251115547020	0	2022-12-14 13:03:14	2022-12-14 13:03:14	\N	\N
f837147f-ebe7-4694-a3ba-0adc44b7a860	Ethswitch S.c	12456	Kazanchis	0911253645	0	2022-11-16 15:28:21	2022-11-16 15:28:21	\N	\N
fac7f712-aea2-4860-b4c9-987939e79200	VFS	5410000231	Saudi	2348077594106	0	2023-04-04 20:37:25	2023-04-04 20:37:25	\N	\N
fb1aaf46-bd20-4ee0-95ab-449d867981b2	Adiss Ababa University	8085	Addis Ababa, Ethiopia	+251-115-570544	0	2023-01-03 13:23:53	2023-01-03 13:23:53	\N	\N
fb42a1bf-e17c-40d1-a061-c931614888a0	Bunna Bank	12345	Arat kilo	0940392834	0	2023-03-09 14:45:26	2023-03-09 14:45:26	\N	\N
\.


--
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency (name, code, symbol, active, created_at, updated_at, id, format, exchange_rate) FROM stdin;
U.S. Dollar	USD	$	1	1	\N	1	$1	0.00
Arabic Dirham	AED	AED	1	1	\N	2	1	0.00
Canadian Dollar	CAD	C$	1	1	\N	3	1	0.00
Euro	EUR	€	1	1	\N	4	1	0.00
Pound	GBP	£	1	1	\N	5	1	0.00
South African Rand	ZAR	ZAR	1	1	\N	6	1	0.00
Birr	ETB	ETB	1	1	\N	7	1	0.00
Chinese Yuan	Yuan	¥	1	1	\N	8	1	0.00
\.


--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department (id, "departmentName", abbrivation, "departmentProductManager", "idDeleted", "createdBy", "updatedBy", "createdAt", "updatedAt") FROM stdin;
13d0b1c2-9add-43d9-9e81-006aef68b7ac	TechFin	TF	ca4391d3-0cab-4b13-acfd-4db35f94dcfa	t	\N	\N	2022-11-07 12:37:12	2022-11-07 14:46:38
1d3508db-2899-49fe-9c9b-46b8626c63f4	Data Center Facility	DCF	3e02ba82-eef4-4c88-8acc-b6cf8c09c956	t	\N	\N	2022-10-25 06:37:12	2022-11-07 12:39:40
2b3a11af-9e2f-487b-87d8-95dc3b82a6cb	Software as a Service	SaaS	4a6dd0e8-d354-431b-bed3-933b32828719	f	\N	\N	2022-11-07 12:31:31	2022-11-07 12:31:31
57699ee3-448c-471f-a677-9f0158902140	Test product	TP	3e02ba82-eef4-4c88-8acc-b6cf8c09c956	t	\N	\N	2023-01-10 15:45:15	2023-01-10 15:58:31
6434d36c-7c76-4fe3-a64c-31895e0ffd96	Enterprise Network Service	ENS	b7efd943-f1e8-4a29-9882-69b8231c07c0	f	\N	\N	2022-10-27 11:42:32	2022-11-07 12:25:02
7b58e14d-ac58-46aa-8835-384fa6e3fed1	TechFin	TechFin	ca4391d3-0cab-4b13-acfd-4db35f94dcfa	f	\N	\N	2022-11-07 14:47:47	2022-11-07 14:47:47
7d4cf94c-1dd0-4708-8a3e-43e137c2f9f7	Modern cloud and data center	MDCC	25fee66b-f873-4e58-8053-e3dbfaec4238	f	\N	\N	2022-10-27 11:57:19	2022-11-07 12:20:11
94f27c61-1396-4a3b-8267-aaf61a4ef0f6	Test product	TP	\N	f	\N	\N	2023-05-08 19:54:50	2023-08-21 15:03:02
989ea2cd-6f17-4d05-a0bb-73da8e6ee1c0	Information Technology Facility	ITF	1b19cf0e-c88a-4c92-8604-e6b7fabbeb36	f	\N	\N	2022-10-27 11:47:45	2022-11-07 12:38:16
a2dcfa5c-3b4c-4c1e-b5b1-3d68a0076e0b	Test-Solution	TS	e3e98f6e-e20c-4b24-9983-291c42e1e193	f	\N	\N	2023-08-17 14:14:46	2023-08-17 14:14:46
a608ad96-9902-49cb-8b07-ebbe31ecbe95	Test Solution	TS	2e2e6753-15fc-4af9-a536-37c14f4e4b2d	t	\N	\N	2023-08-17 14:09:23	2023-08-17 14:10:50
a82bd09b-5896-494a-9445-9a550587521f	Test	T_1	3e02ba82-eef4-4c88-8acc-b6cf8c09c956	t	\N	\N	2022-11-16 19:21:10	2022-11-16 19:21:32
afecd91c-8a2d-430d-b1a6-16f71388e006	SaaS	Software as a Service	4a6dd0e8-d354-431b-bed3-933b32828719	t	\N	\N	2022-11-07 12:30:22	2022-11-07 12:31:06
b94889ee-7b00-499f-adf5-77aaef6ca7da	Business Automation Intelligence	BAI	3e02ba82-eef4-4c88-8acc-b6cf8c09c956	f	\N	\N	2022-10-25 06:35:35	2022-10-25 06:35:35
c199e18b-cfe3-48fd-b2b7-8bfdcddd979e	Test 2	T2	00bf1d57-8760-471d-8602-615abd7cd977	t	\N	\N	2023-01-10 15:50:01	2023-01-10 15:58:15
ef81f577-d53e-4312-a6a3-53236a4ca713	new test	nT	022cd2f1-d84e-4613-b236-b862756b374a	t	\N	\N	2023-01-10 15:58:48	2023-01-10 15:59:29
\.


--
-- Data for Name: individualLL; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."individualLL" (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "LLOwnerName", "LLOwnerId", problem, impact, "lessonLearnedText", "lessonLearnedId") FROM stdin;
9353a102-d48c-4a00-aed4-152185e91551	2023-09-05 10:17:40.52629	2023-09-05 10:17:40.52629	\N	\N	Kirubel Chane	022cd2f1-d84e-4613-b236-b862756b374a	gfchvhvhvghjhjjjjjjjjjjjjjjjjjjj	kjhkjbjbjb	jhbjhnj j n	7cdba30a-74e7-4adf-85e8-c84eb90b59ab
60a27e50-b5e7-48db-9411-c4f84cf2673b	2023-09-05 11:51:09.485566	2023-09-05 11:51:09.485566	\N	\N	Leul Fentaye	00293834-0050-41ec-a0a6-0bee2a1539c0	bhsbhsb	hbsbfhbsjhbsjhs	hbjhvsbhs	ded38139-e7f5-40bc-8fe1-e7906e812266
13c3b372-4f60-42f0-bb29-82bc20933bc7	2023-09-14 19:35:39.406032	2023-09-14 19:35:39.406032	\N	\N	Samuel Negash	09403930-2f0f-4afa-ba12-636c73a2c966	Problems /Issues /Inefficiency /Ineffectiveness	akjsndj	Lesson Learned	4fac5026-54e2-48cd-99b0-0b4fa3a929e4
e3ac7a97-d22e-49d8-b238-12700c535ab4	2023-10-12 09:40:19.960354	2023-10-12 09:40:19.960354	\N	\N	Mulualem Eshetu	00592b61-4639-4eba-a374-766147ce5c0f	ssss	high	ddd	7cdba30a-74e7-4adf-85e8-c84eb90b59ab
4a004b6d-5c00-4192-b2f6-c7adf395d96b	2023-10-12 10:26:22.941008	2023-10-12 10:26:22.941008	\N	\N	Betelihem Yoseph	e3e98f6e-e20c-4b24-9983-291c42e1e193	Test issue one 	impact test	lesson learned test	8496efbd-cb76-4b8a-9d1d-0a50aafa7eb9
0d67a8e2-729c-4928-a147-b4b0a2742b56	2023-11-02 10:41:37.817321	2023-11-02 10:41:37.817321	\N	\N	Eden Solomon	34757047-6135-4677-94d7-d1fa9da10db2	Problems /Issues /Inefficiency /Ineffectiveness	jhasgdjchbajshdbcj	Lesson Learned	21c832ea-061a-4e8d-91e2-f1cbda31dc07
90fafd7f-e015-417e-94d2-2eb31a5e7c2f	2023-12-04 15:45:10.98833	2023-12-04 15:45:10.98833	\N	\N	Surafel Kifle	5a53895e-a8c8-49f7-a353-780b3ab2209d	Resource allocation problem	Time delay	Check the resource and assign users to the specific task	663031ab-a946-424c-b0ed-8bfb2c3e018b
\.


--
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issues (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "riskDescription", "causedBy", consequences, "riskOwner", status, impact, control, "controlOwner", "residualImpact", "projectId") FROM stdin;
36e0aad3-c70c-438c-9fc1-b450395031ee	2023-09-05 11:37:13.447	2023-09-05 11:36:47.167	\N	\N	Description	Caused By	Consequences	Nana	Open	High	Transfered	Controll Owner	High	b121be11-cbcc-41b0-89e4-8e4a289d04b0
b876989b-fad6-4319-a1be-d620617e4d7e	2023-09-05 11:37:58.814528	2023-09-05 11:37:58.814528	\N	\N	Risk Description	Caused By	Consequences	Risk Owner	Closed	High	Avoided	Risk Owner	Medium	b121be11-cbcc-41b0-89e4-8e4a289d04b0
a8c3ef1d-f990-4631-9ea1-bba129da7c46	2023-09-14 19:34:04.196	2023-09-14 19:33:57.629	\N	\N	New Issueeeeeeeeee	Cause by	asdfgfds	Nana	Open	Medium	Transfered	n	High	889bd689-643d-45a7-af6f-289045e35321
dff6d9df-6f86-4c4f-a1a3-241ca651e1ee	2023-09-15 09:51:15.584	2023-09-14 19:25:04.511	\N	\N	New Issue	asjd ck	akjnsdkj	aoiwnedcjna	Open	High	Mitigated	Risk Owner	Medium	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
f223af24-26bc-455b-aa24-2b7a4fa9637d	2023-09-20 15:14:22.126	2023-09-20 15:14:10.812	\N	\N	New Issue	Cause by	asdfgfds	Nana	Open	Medium	Mitigated	adsklfjlk	Medium	b121be11-cbcc-41b0-89e4-8e4a289d04b0
9538403b-c23c-48bd-8ee7-39d5dd2a16f1	2023-09-25 10:51:19.511	2023-09-25 10:50:54.869	\N	\N	Risk Risk	Cause	Conseq	sdaljflk	Open	Very-High	sadfkj	asdf	Very-High	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
b7a1ccbe-7a2d-4ff0-8cf0-aa2076493285	2023-09-05 09:02:51.68347	2023-09-05 09:02:51.68347	\N	\N	Issue on materials	sdfghjklasdfg	asdfgfds	Kdirubel	Closed	High	Avoided	fghjh	High	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
577bf26c-0b0f-4356-b773-6bf095e7a60a	2023-09-25 15:29:51.8	2023-09-25 11:57:22.148	\N	\N	New RIsk	Caos	COmnsq	Nanq	Open	Very-High	asdkfjkl	sdaklfj	Very-High	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
1769a0f8-3dc6-47b0-b186-10d6e5d64177	2023-10-11 16:43:26.574	2023-09-05 08:55:36.04	\N	\N	Delay on CISCO switch delivery	delay	schedule extension updated	Kirubel	Transfered	High	Transfered	adsklfjlk	Medium	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
5a08cefc-3e95-4b04-b67d-77111814d68c	2023-10-12 09:14:58.719065	2023-10-12 09:14:58.719065	\N	\N	Risk	Cause	conseq	Risk	Open	Very High	Accepted	klsdjflkj	Very High	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
bf4f78a3-d9e2-4d52-83d8-a2271b3d2710	2023-10-12 09:17:23.711295	2023-10-12 09:17:23.711295	\N	\N	lksadjflkjasdlkjf	lkjdsalkjflkjdsalkj	lkjdslkjfalkj	lksdjaflkjlkdsaj	Closed	Very High	akldsajflkjsdalk	kldjflkjaslkf	Very High	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
fe4fa268-ec1a-4ed3-be10-687e89861c2c	2023-10-12 10:32:53.02	2023-10-12 10:32:37.183	\N	\N	test risk betty	Betty	Delay	betty	Open	Very-High	Avoided	jghghgy	Medium	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a
b58bd973-56ca-4788-b1c5-f2b3c7c0c6d6	2023-10-17 09:02:09.297	2023-10-17 08:52:22.87	\N	\N	New rizzz	sdfghjklasdfg	asdfgfds	Risk Owner	Open	Low	rtrtrtrt	adsklfjlk	High	1a946cd8-4917-4499-837a-33291189b67c
8c78623d-f849-4524-a086-5fe88f93661b	2023-10-27 16:50:16.899	2023-09-26 16:52:41.496	\N	\N	Issue Test 	Betty	Delay	betty	Open	Medium	Mitigated	betty	High	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
852ea911-6d05-4013-8f75-cfdd08305e07	2023-11-01 17:20:46.372	2023-11-01 17:20:37.03	\N	\N	Risk 	nA	LKJASDLKFJ	ASDFGASDF	Open	Very-High	ASDFDS	ASFDASDFQ	Very-High	b121be11-cbcc-41b0-89e4-8e4a289d04b0
d1ba10cd-2978-4ca6-ab45-2899cb90728e	2023-11-02 09:10:58.883	2023-09-25 12:22:46.838	\N	\N	RIsk	Caaa	Cons	asldjf	Open	Very-High	asdfkj	sdf	Very-High	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
d7f72ed7-d982-4de1-bda6-e2960b3630ab	2023-09-25 10:34:08.804	2023-09-15 09:52:44.837	\N	\N	Risk Description	reason	Consequences	Kirubel	Closed	High	Mklkdlsajlkfj	fd	High	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
04041867-3025-48c4-831c-834f576d7823	2023-11-02 09:15:53.879	2023-11-02 09:15:15.047	\N	\N	Resource constraint	Daynamic evt	high	Daniel	Closed	High	Transfer	Nahi	Medium	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
9b4f945c-d9c6-4f05-ae12-3d8bcb48fb68	2023-12-04 15:35:36.766	2023-12-04 15:35:06.379	\N	\N	Issue descriptionbj	Reason	damage	surafel kifle	Open	Low	Transfered	surafel	High	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
07b8c1f1-a75d-461f-8667-aa3f452e160b	2023-12-04 15:36:17.80771	2023-12-04 15:36:17.80771	\N	\N	Issue description	Reason	damage	surafel kifle	Open	Low	Transfered	surafel	Very High	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
16683e1b-9f95-4e71-8159-d4fa56b4911d	2023-12-04 17:00:34.011	2023-12-04 15:35:07.526	\N	\N	Issue descriptionbj	Reason	damage	surafel kifle	Open	Low	Transfered	surafel	High	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
\.


--
-- Data for Name: lessonLearned; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."lessonLearned" (id, "createdAt", "updatedAt", "createdBy", "updatedBy", name, "PMOMName", "PMOMId", "PMName", "PMId", date, status, "projectId", "departmentId") FROM stdin;
7cdba30a-74e7-4adf-85e8-c84eb90b59ab	2023-09-05 10:13:10.110607	2023-09-05 10:13:10.110607	\N	\N	LL one	Addisu Denboba	73dccf3d-8138-4e54-9d2f-fb8a930c9e6b	Daniel Degu	33465d05-1fd6-4d57-9690-8650773201b4	Tue Sep 05 2023 10:13:09 GMT+0300 (East Africa Time)	Created	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	2b3a11af-9e2f-487b-87d8-95dc3b82a6cb
ded38139-e7f5-40bc-8fe1-e7906e812266	2023-09-05 11:50:13.385263	2023-09-05 11:50:13.385263	\N	\N	title	Addisu Denboba	73dccf3d-8138-4e54-9d2f-fb8a930c9e6b	Surafel Kifle	5a53895e-a8c8-49f7-a353-780b3ab2209d	Tue Sep 05 2023 11:50:13 GMT+0300 (East Africa Time)	Created	b121be11-cbcc-41b0-89e4-8e4a289d04b0	1d3508db-2899-49fe-9c9b-46b8626c63f4
4fac5026-54e2-48cd-99b0-0b4fa3a929e4	2023-09-14 19:35:09.637918	2023-09-14 19:35:09.637918	\N	\N	Lesson 1	Tinsae Kidane	08a56d82-2c87-45f1-8027-af5b2f2e0688	Kirubel Chane	022cd2f1-d84e-4613-b236-b862756b374a	Thu Sep 14 2023 19:35:09 GMT+0300 (East Africa Time)	Created	889bd689-643d-45a7-af6f-289045e35321	afecd91c-8a2d-430d-b1a6-16f71388e006
8496efbd-cb76-4b8a-9d1d-0a50aafa7eb9	2023-10-12 10:25:34.750626	2023-10-12 10:25:34.750626	\N	\N	Test1	Betelihem Yoseph	e3e98f6e-e20c-4b24-9983-291c42e1e193	Betelihem Yoseph	e3e98f6e-e20c-4b24-9983-291c42e1e193	Thu Oct 12 2023 10:25:34 GMT+0300 (East Africa Time)	Created	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a	2b3a11af-9e2f-487b-87d8-95dc3b82a6cb
21c832ea-061a-4e8d-91e2-f1cbda31dc07	2023-11-02 10:41:00.585587	2023-11-02 10:41:00.585587	\N	\N	Milestone 1	IE Support Ticket	00bf1d57-8760-471d-8602-615abd7cd977	Kirubel Chane	022cd2f1-d84e-4613-b236-b862756b374a	Thu Nov 02 2023 10:41:00 GMT+0300 (East Africa Time)	Created	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	1d3508db-2899-49fe-9c9b-46b8626c63f4
663031ab-a946-424c-b0ed-8bfb2c3e018b	2023-12-04 15:43:01.414449	2023-12-04 15:43:01.414449	\N	\N	Bethelhem Mewcha	Addisu Denboba	73dccf3d-8138-4e54-9d2f-fb8a930c9e6b	Surafel Kifle	5a53895e-a8c8-49f7-a353-780b3ab2209d	Mon Dec 04 2023 15:43:01 GMT+0300 (East Africa Time)	Created	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	13d0b1c2-9add-43d9-9e81-006aef68b7ac
\.


--
-- Data for Name: llComments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."llComments" (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "userId", comment, "lessonLearnedId", date) FROM stdin;
5b3047fa-2236-4e32-a35c-524f142fec63	2023-09-05 10:40:35.347123	2023-09-05 10:40:35.347123	\N	\N	59258c1d-9735-40cb-94b9-02d0f4bd25ce	jbjbjbj	7cdba30a-74e7-4adf-85e8-c84eb90b59ab	2023-09-05T10:40:35.334+03:00
671f53e7-44a2-4aff-9d31-62bc19c237de	2023-09-05 12:10:10.216652	2023-09-05 12:10:10.216652	\N	\N	59258c1d-9735-40cb-94b9-02d0f4bd25ce	fvf	ded38139-e7f5-40bc-8fe1-e7906e812266	2023-09-05T12:10:10.215+03:00
f5dda9eb-e01f-4a67-940a-4e1b752fa3d8	2023-09-20 15:32:27.002476	2023-09-20 15:32:27.002476	\N	\N	59258c1d-9735-40cb-94b9-02d0f4bd25ce	Comment	ded38139-e7f5-40bc-8fe1-e7906e812266	2023-09-20T15:32:27.001+03:00
b8c0df61-8172-46df-a524-b6f649d6c53d	2023-10-12 10:30:03.5871	2023-10-12 10:30:03.5871	\N	\N	59258c1d-9735-40cb-94b9-02d0f4bd25ce	test comment	8496efbd-cb76-4b8a-9d1d-0a50aafa7eb9	2023-10-12T10:30:03.585+03:00
648c6d40-6f4a-4d14-8f43-9e2124609aa8	2023-12-04 15:45:52.749179	2023-12-04 15:45:52.749179	\N	\N	59258c1d-9735-40cb-94b9-02d0f4bd25ce	ihhyugh	663031ab-a946-424c-b0ed-8bfb2c3e018b	2023-12-04T15:45:52.747+03:00
\.


--
-- Data for Name: milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.milestones (id, "createdAt", "updatedAt", "createdBy", "updatedBy", name, status, weight, "projectId", "paymentTermId") FROM stdin;
0ece0b2f-b416-40e5-b0b2-5090870c945d	2023-10-05 18:08:57.601211	2023-10-05 18:08:57.601211	\N	\N	Milestone 2	t	50	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	1bb96ef9-562c-47da-b379-e211f18431f1
41d45917-8f2f-476f-b03e-180b3b0d6751	2023-10-05 18:07:21.094459	2023-10-05 18:07:21.094459	\N	\N	Milestone 1	t	50	b121be11-cbcc-41b0-89e4-8e4a289d04b0	71367874-a5c1-46b9-be41-a4ae7344d54e
5979e3ed-f88c-4bfe-be24-d2b1a319b6b3	2023-10-06 09:33:10.042638	2023-10-06 09:33:10.042638	\N	\N	Milestone 1	t	10	b7029129-ce20-4b1e-92de-a08b522379c5	9bcaeffa-d324-43b7-8685-829a5588942b
fda26103-6e37-43eb-9317-8513ec1fceac	2023-10-06 09:33:19.941275	2023-10-06 09:33:19.941275	\N	\N	Milestone 2	t	10	b7029129-ce20-4b1e-92de-a08b522379c5	f5ebe5bb-98cd-4e61-97bb-ee427b6424b7
90c40b16-ba25-463f-af81-cc503a113e87	2023-12-04 11:49:27.08552	2023-12-04 11:49:27.08552	\N	\N	mile 2	t	20	168da302-8bf6-4b1d-8126-e329fbf1b2e9	\N
b7934c6c-a271-4e13-8565-66a91bfbb6fb	2023-12-04 11:49:19.810937	2023-12-04 11:49:19.810937	\N	\N	mile 1	t	2	168da302-8bf6-4b1d-8126-e329fbf1b2e9	4f18bc17-7483-46b6-ae0e-8cabc43c04e5
09ccbb10-2223-4420-ba9f-8e4e7b5c59e3	2023-12-04 14:16:35.413521	2023-12-04 14:16:35.413521	\N	\N	milestone 2	t	20	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	\N
5289d858-d320-4d7c-823c-f4ed1a38a985	2023-10-06 09:41:54.670555	2023-10-06 09:41:54.670555	\N	\N	Selamawit	t	50	e98024d6-74db-4690-8eaa-849028adf1c9	be98286a-cc4e-4007-a52c-6bec3f1d9e8f
d3ddedb1-f87b-4644-9027-592e0bf05391	2023-10-06 09:41:46.136667	2023-10-06 09:41:46.136667	\N	\N	Selam	t	50	e98024d6-74db-4690-8eaa-849028adf1c9	5206978d-0bc5-44f8-9f9f-6ac1490ade21
dc854e84-f8dc-41d3-abbc-c85d7e34406a	2023-10-06 09:53:56.159669	2023-10-06 09:53:56.159669	\N	\N	Milestone 2	t	50	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	53c6293a-b2b4-401b-a48c-b4c3ab2c731c
09ebcfc7-d63e-4dc2-b3fc-97c4f2948ca9	2023-10-06 09:53:35.015458	2023-10-06 09:53:35.015458	\N	\N	Milestone 1	t	50	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	03b75267-7c85-46ae-812b-96070fc1188a
2c9e00e5-2c15-4bc1-b3e5-c70413fe197d	2023-10-12 10:49:29.261313	2023-10-12 10:49:29.261313	\N	\N	Test1	t	5	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a	\N
57582e26-7d60-496a-963b-8dcd6ed0f97c	2023-10-05 18:00:05.907047	2023-10-05 18:00:05.907047	\N	\N	Milestone 1	t	23	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
4149a6a6-8a71-4a5a-bc4e-82beb7b50806	2023-10-17 08:40:05.283322	2023-10-17 08:40:05.283322	\N	\N	Milestone 1	t	46	1a946cd8-4917-4499-837a-33291189b67c	\N
8f164012-ed52-4ad8-8deb-543454504ccb	2023-10-17 11:08:30.702029	2023-10-17 11:08:30.702029	\N	\N	jdscakjsdn	t	2	21351d69-2f54-451e-978c-c487dc43cc59	\N
b98a329a-ef2c-4d0b-af70-43d111b2ec48	2023-10-17 11:10:02.69513	2023-10-17 11:10:02.69513	\N	\N	Milestone 2	t	4	21351d69-2f54-451e-978c-c487dc43cc59	\N
1d20469a-fa4e-4019-b074-174327a3a6a9	2023-10-31 16:42:02.922252	2023-10-31 16:42:02.922252	\N	\N	Milestone 3	t	56	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	\N
31840152-e7e4-496b-97f9-2d96c665a8fb	2023-11-01 14:35:32.168366	2023-11-01 14:35:32.168366	\N	\N	kjhkh	t	100	b121be11-cbcc-41b0-89e4-8e4a289d04b0	\N
898f89aa-0d28-4bf3-b330-f020b5ce0242	2023-11-01 14:35:36.648091	2023-11-01 14:35:36.648091	\N	\N	kjhkh	t	100	b121be11-cbcc-41b0-89e4-8e4a289d04b0	\N
5bfddf14-2057-41dd-b3ba-dd19747ea95c	2023-11-01 14:35:40.543179	2023-11-01 14:35:40.543179	\N	\N	kjhkh	t	100	b121be11-cbcc-41b0-89e4-8e4a289d04b0	\N
361c4d40-4abd-40e2-91f3-d92c344a1ddf	2023-11-01 14:59:25.026066	2023-11-01 14:59:25.026066	\N	\N	gjhfjhghj	t	4566	b121be11-cbcc-41b0-89e4-8e4a289d04b0	\N
a48f8875-2554-4688-b19d-22631004e312	2023-10-31 16:30:27.320082	2023-10-31 16:30:27.320082	\N	\N	MIlestone 2	t	2	1a946cd8-4917-4499-837a-33291189b67c	\N
bc8114f2-4dfc-4908-80b5-1d9596cacc83	2023-12-04 07:46:58.890597	2023-12-04 07:46:58.890597	\N	\N	Milestone 1	t	30	166fcd53-fc7c-4674-bb41-af8024903940	\N
39e80f11-77dc-44d4-bade-521619529056	2023-12-04 07:47:37.35025	2023-12-04 07:47:37.35025	\N	\N	Milestone 3	t	30	166fcd53-fc7c-4674-bb41-af8024903940	\N
84760750-892d-4770-b06e-6fd298ccc4d6	2023-12-04 07:47:46.170196	2023-12-04 07:47:46.170196	\N	\N	Milestone 2	t	40	166fcd53-fc7c-4674-bb41-af8024903940	\N
8c1e2229-d45a-43e0-998d-862c38688cdc	2023-12-04 07:52:50.646689	2023-12-04 07:52:50.646689	\N	\N	hhhh	t	6	2bb68de0-26c4-489e-8bda-160f9e8858ec	\N
858cbd7c-d67d-41e7-9d60-1b8b8ec4cfca	2023-12-04 14:16:44.985607	2023-12-04 14:16:44.985607	\N	\N	milestone 3	t	60	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	\N
80bc2479-6cea-44ce-9622-528c4a981ddf	2023-12-04 14:16:19.600823	2023-12-04 14:16:19.600823	\N	\N	milestone 1	t	20	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	ddf25d5f-1ee8-4419-b962-f8eb8beb202a
\.


--
-- Data for Name: minute_of_meetings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.minute_of_meetings (id, "createdAt", "updatedAt", "createdBy", "updatedBy", title, "meetingDate", "meetingTime", location, "facilitatorId", objective, "specialNote", "externalAttendees", "projectId") FROM stdin;
0085f246-c885-4568-b0e3-c7bfa137a326	2023-09-05 11:57:18.749317	2023-09-05 11:57:18.749317	\N	\N	Meeting Name	2023-09-05	00:54	Amazon	6d2e50d0-7093-4f2d-9d96-8293f8832556	Meeting Objective	Special Note	[{"name":"Shghg","company":"Com","email":"Suma@gmail.com"},{"name":"FHjh","company":"Dep","email":"D@gmail.com"}]	b121be11-cbcc-41b0-89e4-8e4a289d04b0
f964f055-5efa-47f5-a2bf-c2c61242f744	2023-09-15 07:39:10.823177	2023-09-15 07:39:10.823177	\N	\N	jbasdkbck	2023-09-21	07:39	here	e0c0d17e-2c04-4b90-9905-3cf04f38b4bd	jhaskjdbkjbaskd	sfghjkl;kjhgf	[{"name":"hgfhgtfhfhvh","company":"jgvhgvh","email":"jgtfhvh"}]	889bd689-643d-45a7-af6f-289045e35321
ca58ecb5-3b96-4313-8355-3d9cc7388fad	2023-09-15 10:10:26.579003	2023-09-15 10:10:26.579003	\N	\N	Meeting Name	2023-09-15	10:07	Tesla 	3a464d46-a7ae-4f38-8635-dc1bc18761f9	Meeting Objective	Special Note	[{"name":"Abeselom","company":"Demo","email":"kirasimachew@gmail.com"}]	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
cb120e7a-5d11-4fe2-b933-c3c180585c0a	2023-09-05 10:20:55.935143	2023-09-05 10:20:55.935143	\N	\N	meeting	2023-09-05	00:18	SaaS	3a464d46-a7ae-4f38-8635-dc1bc18761f9	ddddddddddddd ggggg	cuaksdnckasdc	[{"name":"Attend","company":"Saas","email":""}]	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
d8ad5357-aaa8-4e86-887a-cc3c34ce5e11	2023-10-10 09:19:48.931386	2023-10-10 09:19:48.931386	\N	\N	tst 1	2023-10-11	10:18	Tesla 	b473dd62-d666-42ac-8c47-02d222db4c00	test ob	dddd	[{"name":"ss","company":"saas","email":"selamawit.getaneh@ienetworksolutions.com"}]	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
9b92b32f-1d4a-46f7-a73b-77fb000fb997	2023-10-10 09:19:49.07586	2023-10-10 09:19:49.07586	\N	\N	tst 1	2023-10-11	10:18	Tesla 	b473dd62-d666-42ac-8c47-02d222db4c00	test ob	dddd	[{"name":"ss","company":"saas","email":"selamawit.getaneh@ienetworksolutions.com"}]	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
54b70300-7645-4a1a-9db6-f94922cc6fa8	2023-10-10 12:09:16.264098	2023-10-10 12:09:16.264098	\N	\N	final test	2023-10-10	16:07	Tesla 	09403930-2f0f-4afa-ba12-636c73a2c966	fial objective	fianl special note  test 	[{"name":"ss","company":"saas","email":"y@h"},{"name":"cc","company":"saas","email":"r@qasdc.com"}]	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
5b009040-736b-4511-a9c4-016b0cd93ee3	2023-12-04 15:52:41.828377	2023-12-04 15:52:41.828377	\N	\N	AUC Supply items and Shipment	2023-12-29	15:53	Addis Ababa	5a53895e-a8c8-49f7-a353-780b3ab2209d	PM Module mom	Thank you  	[{"name":"other","company":"AUC","email":"Surafel@ienetworks.co"}]	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
\.


--
-- Data for Name: mom_action_responsible; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mom_action_responsible (id, "userId", "momActionId") FROM stdin;
\.


--
-- Data for Name: mom_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mom_actions (id, "createdAt", "updatedAt", "createdBy", "updatedBy", action, deadline, "momId") FROM stdin;
0af6e52b-93e1-4203-a551-e4c14275f810	2023-09-05 10:20:55.993856	2023-09-05 10:20:55.993856	\N	\N	jhzbdsjcbjasdc		cb120e7a-5d11-4fe2-b933-c3c180585c0a
c527a44c-c4c4-4210-9473-fb619f63b611	2023-09-05 11:57:18.785429	2023-09-05 11:57:18.785429	\N	\N	bhbfhdbyguys	2023-09-28	0085f246-c885-4568-b0e3-c7bfa137a326
b0d9ec3d-e50d-417e-8681-1b84fde70ccf	2023-09-15 07:39:10.955754	2023-09-15 07:39:10.955754	\N	\N	asdfghjkl;	2023-09-27	f964f055-5efa-47f5-a2bf-c2c61242f744
b34745d5-9a3c-464d-b2e6-68d76f6465dc	2023-09-15 10:10:26.787239	2023-09-15 10:10:26.787239	\N	\N	Action/s to be taken after the meeting	2023-09-16	ca58ecb5-3b96-4313-8355-3d9cc7388fad
8b640e75-bcfb-4606-a258-2ba0ede3e130	2023-10-10 09:19:49.032901	2023-10-10 09:19:49.032901	\N	\N	ac test	2023-10-26	d8ad5357-aaa8-4e86-887a-cc3c34ce5e11
a16ef8e3-21a9-4bd4-8e66-c21bfcb95892	2023-10-10 09:19:49.088974	2023-10-10 09:19:49.088974	\N	\N	ac test	2023-10-26	9b92b32f-1d4a-46f7-a73b-77fb000fb997
8a87d072-4cb7-4f2d-98f9-f00f6a570cd6	2023-10-10 12:09:16.302706	2023-10-10 12:09:16.302706	\N	\N	action final test	2023-10-11	54b70300-7645-4a1a-9db6-f94922cc6fa8
2acffb45-4e85-4c10-a8b6-6df4e11af642	2023-10-10 12:09:16.306756	2023-10-10 12:09:16.306756	\N	\N	action final test2	2023-11-01	54b70300-7645-4a1a-9db6-f94922cc6fa8
49c015e9-08a1-457a-b0d6-8854bb516430	2023-12-04 15:52:41.938902	2023-12-04 15:52:41.938902	\N	\N	Finalize Ordering items	2023-12-31	5b009040-736b-4511-a9c4-016b0cd93ee3
\.


--
-- Data for Name: mom_agenda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mom_agenda (id, "createdAt", "updatedAt", "createdBy", "updatedBy", agenda, "momId") FROM stdin;
8a8b574d-27ac-4f16-a54b-625eb5710416	2023-09-05 10:20:56.004514	2023-09-05 10:20:56.004514	\N	\N		cb120e7a-5d11-4fe2-b933-c3c180585c0a
1e88f9b3-4746-41ef-a6d9-ffd2eeb0a92a	2023-09-05 10:20:56.021956	2023-09-05 10:20:56.021956	\N	\N		cb120e7a-5d11-4fe2-b933-c3c180585c0a
9e776c08-516d-4c00-b5c0-c0c8573e11db	2023-09-05 11:57:18.790964	2023-09-05 11:57:18.790964	\N	\N	Agenda	0085f246-c885-4568-b0e3-c7bfa137a326
77b1eaf3-668f-4421-9c40-d205a6b06c5f	2023-09-15 07:39:10.969477	2023-09-15 07:39:10.969477	\N	\N	hggjhjgjhjgj	f964f055-5efa-47f5-a2bf-c2c61242f744
e7f3d31d-8e5b-450a-9caa-528835ed19b3	2023-09-15 07:39:11.008478	2023-09-15 07:39:11.008478	\N	\N	rdgfcgfcgfcgfcgf	f964f055-5efa-47f5-a2bf-c2c61242f744
56a57439-e920-4855-9f6e-010d8360e7ce	2023-09-15 10:10:26.800074	2023-09-15 10:10:26.800074	\N	\N		ca58ecb5-3b96-4313-8355-3d9cc7388fad
37a85d10-e375-4a93-baf4-bc81eac63542	2023-10-10 09:19:49.042017	2023-10-10 09:19:49.042017	\N	\N		d8ad5357-aaa8-4e86-887a-cc3c34ce5e11
d5c6478d-29b6-44f8-8cbe-017548d21741	2023-10-10 09:19:49.095595	2023-10-10 09:19:49.095595	\N	\N		9b92b32f-1d4a-46f7-a73b-77fb000fb997
35daa354-1226-4af1-8731-bab78fe7842f	2023-10-10 12:09:16.309992	2023-10-10 12:09:16.309992	\N	\N		54b70300-7645-4a1a-9db6-f94922cc6fa8
76eaebdb-710b-44aa-b008-dac0e36a0c9e	2023-12-04 15:52:41.951659	2023-12-04 15:52:41.951659	\N	\N	New Agenda	5b009040-736b-4511-a9c4-016b0cd93ee3
\.


--
-- Data for Name: mom_agenda_topic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mom_agenda_topic (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "agendaPoints", "userId", "otherUser", "agendaId") FROM stdin;
fc9bcbb5-752c-4f8f-9864-a3eaf30c478d	2023-09-05 10:20:56.013101	2023-09-05 10:20:56.013101	\N	\N	meeting Agenda	dfc6b4b5-a7ba-42b0-88ed-f4e94bfb3bc8	\N	8a8b574d-27ac-4f16-a54b-625eb5710416
a733d3d0-f61f-49c4-b949-5e880c2dfae0	2023-09-05 10:20:56.02783	2023-09-05 10:20:56.02783	\N	\N	meeting agdenda	dfc6b4b5-a7ba-42b0-88ed-f4e94bfb3bc8	\N	1e88f9b3-4746-41ef-a6d9-ffd2eeb0a92a
21b06f0e-7c9a-4b1d-a798-058930bf9719	2023-09-05 11:57:18.798014	2023-09-05 11:57:18.798014	\N	\N	suhrbjabjrafafha	5a53895e-a8c8-49f7-a353-780b3ab2209d	\N	9e776c08-516d-4c00-b5c0-c0c8573e11db
b5a2617b-b313-49ac-9270-0b75b77212bd	2023-09-15 07:39:10.987193	2023-09-15 07:39:10.987193	\N	\N	kbjhbjbjbhjhbjb	4a29e7a9-303f-47ad-91fb-1b5eda5d110b	\N	77b1eaf3-668f-4421-9c40-d205a6b06c5f
a294cf78-df6d-4803-ac5e-440e2e13c520	2023-09-15 07:39:11.018367	2023-09-15 07:39:11.018367	\N	\N	gcgfchgvhvhvhgvhgvh	4a29e7a9-303f-47ad-91fb-1b5eda5d110b	\N	e7f3d31d-8e5b-450a-9caa-528835ed19b3
1c78cc27-1bf1-4a28-8db4-4ce5d9cad500	2023-09-15 07:39:11.030867	2023-09-15 07:39:11.030867	\N	\N	hgfhgvhvhgvjbjkkjnk	2e9bd9e1-70b2-46b3-bc40-d33d1012283a	\N	e7f3d31d-8e5b-450a-9caa-528835ed19b3
d1f7468a-9d4b-48ff-8524-9df1d7c95f2d	2023-09-15 10:10:26.823981	2023-09-15 10:10:26.823981	\N	\N	Agenda	3a464d46-a7ae-4f38-8635-dc1bc18761f9	\N	56a57439-e920-4855-9f6e-010d8360e7ce
72590336-1976-4c1f-be3e-166f871e6663	2023-10-10 09:19:49.051376	2023-10-10 09:19:49.051376	\N	\N	tst ag1	61894d14-192d-4d8e-b795-f893fd39ba98	\N	37a85d10-e375-4a93-baf4-bc81eac63542
c2a6bcb4-9d32-4e30-a824-3642a7684b3a	2023-10-10 09:19:49.060965	2023-10-10 09:19:49.060965	\N	\N	test ag2	61894d14-192d-4d8e-b795-f893fd39ba98	\N	37a85d10-e375-4a93-baf4-bc81eac63542
d4c73405-2148-4f81-b068-65cfe9878f4c	2023-10-10 09:19:49.102077	2023-10-10 09:19:49.102077	\N	\N	tst ag1	61894d14-192d-4d8e-b795-f893fd39ba98	\N	d5c6478d-29b6-44f8-8cbe-017548d21741
ef4115d9-de06-40f9-8f91-dff18d316e87	2023-10-10 09:19:49.108907	2023-10-10 09:19:49.108907	\N	\N	test ag2	61894d14-192d-4d8e-b795-f893fd39ba98	\N	d5c6478d-29b6-44f8-8cbe-017548d21741
347d3f4e-6914-49c2-a46e-935d1441fc0f	2023-10-10 12:09:16.314193	2023-10-10 12:09:16.314193	\N	\N	final ag 2	0949c8e8-66e4-4f4d-a4d9-25ac3604792d	\N	35daa354-1226-4af1-8731-bab78fe7842f
9a78b111-0d4e-4fa9-bbad-f1c7e85001f0	2023-10-10 12:09:16.318535	2023-10-10 12:09:16.318535	\N	\N	final ag 2	141dc1b9-36c2-496e-966f-1e7a7e763cd7	\N	35daa354-1226-4af1-8731-bab78fe7842f
8f639ef9-f2fa-46c2-b09b-f71e31119722	2023-12-04 15:52:41.965827	2023-12-04 15:52:41.965827	\N	\N	Please finalize ASAP	fb676481-e015-484d-bc44-b006f9cf489b	\N	76eaebdb-710b-44aa-b008-dac0e36a0c9e
\.


--
-- Data for Name: mom_attendees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mom_attendees ("userId", "momId") FROM stdin;
dfc6b4b5-a7ba-42b0-88ed-f4e94bfb3bc8	cb120e7a-5d11-4fe2-b933-c3c180585c0a
5a53895e-a8c8-49f7-a353-780b3ab2209d	0085f246-c885-4568-b0e3-c7bfa137a326
59258c1d-9735-40cb-94b9-02d0f4bd25ce	0085f246-c885-4568-b0e3-c7bfa137a326
8a3cd45a-893d-4da6-8825-4962e7b8d158	0085f246-c885-4568-b0e3-c7bfa137a326
4a29e7a9-303f-47ad-91fb-1b5eda5d110b	f964f055-5efa-47f5-a2bf-c2c61242f744
2e9bd9e1-70b2-46b3-bc40-d33d1012283a	f964f055-5efa-47f5-a2bf-c2c61242f744
c721de15-78ba-47fb-8d8b-43075a6d666c	f964f055-5efa-47f5-a2bf-c2c61242f744
3a464d46-a7ae-4f38-8635-dc1bc18761f9	ca58ecb5-3b96-4313-8355-3d9cc7388fad
59258c1d-9735-40cb-94b9-02d0f4bd25ce	ca58ecb5-3b96-4313-8355-3d9cc7388fad
61894d14-192d-4d8e-b795-f893fd39ba98	d8ad5357-aaa8-4e86-887a-cc3c34ce5e11
61894d14-192d-4d8e-b795-f893fd39ba98	9b92b32f-1d4a-46f7-a73b-77fb000fb997
0949c8e8-66e4-4f4d-a4d9-25ac3604792d	54b70300-7645-4a1a-9db6-f94922cc6fa8
141dc1b9-36c2-496e-966f-1e7a7e763cd7	54b70300-7645-4a1a-9db6-f94922cc6fa8
0fb0849c-f669-44be-81d6-b54f25a581b9	54b70300-7645-4a1a-9db6-f94922cc6fa8
fb676481-e015-484d-bc44-b006f9cf489b	5b009040-736b-4511-a9c4-016b0cd93ee3
9e9d2642-5a21-48a0-aca6-2dfa6abcfb18	5b009040-736b-4511-a9c4-016b0cd93ee3
cb4ffa1a-d67e-4fed-9554-e67ab486f78f	5b009040-736b-4511-a9c4-016b0cd93ee3
\.


--
-- Data for Name: mom_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mom_comment (id, "createdAt", "updatedAt", "createdBy", "updatedBy", comment, "momId", "userId") FROM stdin;
4306f8c5-2c94-4bb0-997e-b263a61f993b	2023-09-21 17:16:04.068357	2023-09-21 17:16:04.068357	\N	\N	bdfbhSFHw hfvhsvyf	cb120e7a-5d11-4fe2-b933-c3c180585c0a	59258c1d-9735-40cb-94b9-02d0f4bd25ce
\.


--
-- Data for Name: monthly_budget_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monthly_budget_comments (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "budgetComment", "userId", "monthlyBudgetId") FROM stdin;
666bdfae-dd70-4132-8212-e305567c1b1a	2023-11-30 12:04:59.77827	2023-11-30 12:04:59.77827	\N	\N	rejected	\N	591f3dd8-a2ec-48f6-b761-1d498fa6e273
b236a1e8-417d-4c65-858c-52baa7338751	2023-12-06 09:47:59.566297	2023-12-06 09:47:59.566297	\N	\N	gggg	\N	447374f1-87cc-4f35-913a-fdcd347f688c
\.


--
-- Data for Name: monthly_budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monthly_budgets (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "budgetsData", "from", "to", approved, rejected, "approvalStageId") FROM stdin;
591f3dd8-a2ec-48f6-b761-1d498fa6e273	2023-11-30 12:04:30.219642	2023-11-30 12:04:30.219642	\N	\N	[{"taskCategory_id":"46f89e6a-37f9-4668-b89d-9a265b93ca20","taskCategory_createdAt":"2023-08-29T12:49:25.441Z","taskCategory_updatedAt":"2023-08-29T12:49:25.441Z","taskCategory_createdBy":null,"taskCategory_updatedBy":null,"taskCategory_budgetTaskCategoryName":"Labor","taskCategory_accountNumber":"12345","taskCategory_budgetTypeId":"1c543947-80cd-458a-a829-6c703b012f63","group_to":"2023-10-31T21:00:00.000Z","group_from":"2023-11-30T21:00:00.000Z","project_id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project_name":"ERA MOTI","currency_id":"2","currency_name":"Arabic Dirham","sum":9999},{"taskCategory_id":"a094e25c-4fcb-4751-80f3-dabcc53d5415","taskCategory_createdAt":"2023-09-01T14:07:20.831Z","taskCategory_updatedAt":"2023-09-01T14:07:20.831Z","taskCategory_createdBy":null,"taskCategory_updatedBy":null,"taskCategory_budgetTaskCategoryName":"Material","taskCategory_accountNumber":"67890","taskCategory_budgetTypeId":"1c543947-80cd-458a-a829-6c703b012f63","group_to":"2023-10-31T21:00:00.000Z","group_from":"2023-11-30T21:00:00.000Z","project_id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project_name":"ERA MOTI","currency_id":"4","currency_name":"Euro","sum":99}]	2023-11-30	2023-10-31	f	t	2583c421-b21e-48fa-88d6-977e9d65ee25
447374f1-87cc-4f35-913a-fdcd347f688c	2023-12-04 13:16:26.331097	2023-12-04 13:16:26.331097	\N	\N	[{"taskCategory_id":"a094e25c-4fcb-4751-80f3-dabcc53d5415","taskCategory_createdAt":"2023-09-01T14:07:20.831Z","taskCategory_updatedAt":"2023-09-01T14:07:20.831Z","taskCategory_createdBy":null,"taskCategory_updatedBy":null,"taskCategory_budgetTaskCategoryName":"Material","taskCategory_accountNumber":"67890","taskCategory_budgetTypeId":"1c543947-80cd-458a-a829-6c703b012f63","group_from":"2023-12-31T21:00:00.000Z","group_to":"2024-01-29T21:00:00.000Z","project_id":"168da302-8bf6-4b1d-8126-e329fbf1b2e9","project_name":"rabbit test 2","currency_id":"1","currency_name":"U.S. Dollar","sum":2000,"from":"2024-01-01T00:00:00.000Z","to":"2024-01-30T00:00:00.000Z"},{"taskCategory_id":"46f89e6a-37f9-4668-b89d-9a265b93ca20","taskCategory_createdAt":"2023-08-29T12:49:25.441Z","taskCategory_updatedAt":"2023-08-29T12:49:25.441Z","taskCategory_createdBy":null,"taskCategory_updatedBy":null,"taskCategory_budgetTaskCategoryName":"Labor","taskCategory_accountNumber":"12345","taskCategory_budgetTypeId":"1c543947-80cd-458a-a829-6c703b012f63","group_from":"2023-12-31T21:00:00.000Z","group_to":"2024-01-29T21:00:00.000Z","project_id":"168da302-8bf6-4b1d-8126-e329fbf1b2e9","project_name":"rabbit test 2","currency_id":"2","currency_name":"Arabic Dirham","sum":3000,"from":"2024-01-01T00:00:00.000Z","to":"2024-01-30T00:00:00.000Z"}]	2024-01-01	2024-01-30	f	t	c51434ea-fda4-4d00-80b7-b931f960ecaf
\.


--
-- Data for Name: payment_term; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_term (id, "createdAt", "updatedAt", "createdBy", "updatedBy", name, amount, "plannedCollectionDate", "actualCollectionDate", status, "projectId", "currencyId", "isOffshore", "isAmountPercent", "budgetTypeId") FROM stdin;
1bb96ef9-562c-47da-b379-e211f18431f1	2023-10-05 19:07:45.511825	2023-10-05 19:07:45.511825	\N	\N	payment 2	100000	2023-10-25	\N	t	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	1	t	f	a93de03c-82bd-4811-b630-afe737b02074
71367874-a5c1-46b9-be41-a4ae7344d54e	2023-10-06 09:27:43.216552	2023-10-06 09:27:43.216552	\N	\N	Birr Payment	10000	2023-10-15	\N	t	b121be11-cbcc-41b0-89e4-8e4a289d04b0	7	f	f	1c543947-80cd-458a-a829-6c703b012f63
fd6b4e83-0ee9-4e25-be93-b802a7d5bc0a	2023-12-04 15:20:22.085597	2023-12-04 15:20:22.085597	\N	\N	Shipment payment	20000	2023-12-29	\N	t	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	7	f	f	a93de03c-82bd-4811-b630-afe737b02074
8cf485ae-ebac-4f4a-86e2-6657dd3057e0	2023-10-06 09:27:43.21583	2023-10-06 09:27:43.21583	\N	\N	Dollar	2000	2023-10-18	\N	t	b121be11-cbcc-41b0-89e4-8e4a289d04b0	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
3894c6d3-6ec6-4aea-88c8-f895bc0e10ae	2023-12-04 12:09:20.757889	2023-12-04 12:09:20.757889	\N	\N	pay 2	3000	2023-12-12	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
970bc633-fa16-4475-8502-d05682b1b0e9	2023-12-04 15:20:22.08633	2023-12-04 15:20:22.08633	\N	\N	professional	10000	2023-12-31	\N	t	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
9bcaeffa-d324-43b7-8685-829a5588942b	2023-10-06 09:40:04.653838	2023-10-06 09:40:04.653838	\N	\N	payment 1	1234	2023-10-01	\N	t	b7029129-ce20-4b1e-92de-a08b522379c5	7	f	f	a93de03c-82bd-4811-b630-afe737b02074
ddf25d5f-1ee8-4419-b962-f8eb8beb202a	2023-12-04 15:20:22.068647	2023-12-04 15:20:22.068647	\N	\N	Order collection	100000	2023-12-12	\N	t	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	7	f	f	a93de03c-82bd-4811-b630-afe737b02074
f5ebe5bb-98cd-4e61-97bb-ee427b6424b7	2023-10-06 09:40:04.654776	2023-10-06 09:40:04.654776	\N	\N	Dollar	8765	2023-10-15	\N	t	b7029129-ce20-4b1e-92de-a08b522379c5	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
4a1a2d2c-e8fa-4715-9234-f24219b50275	2023-12-04 12:15:51.172127	2023-12-04 12:15:51.172127	\N	\N	pay 2	2000	2023-12-20	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	7	f	f	a93de03c-82bd-4811-b630-afe737b02074
85c1c391-6724-4628-a032-75a06e035146	2023-12-04 12:19:41.430984	2023-12-04 12:19:41.430984	\N	\N	pay 2	3000	2023-12-12	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
fb5ed670-efe9-4c60-aed1-51a89cb24e64	2023-10-06 09:48:38.988631	2023-10-06 09:48:38.988631	\N	\N	Birr	1234	2023-10-15	\N	t	e98024d6-74db-4690-8eaa-849028adf1c9	7	f	f	1c543947-80cd-458a-a829-6c703b012f63
3abbcff0-65e5-42af-9f0c-8f4a0cbd9d79	2023-10-06 09:48:38.989746	2023-10-06 09:48:38.989746	\N	\N	payment 2	3214	2023-10-01	\N	t	e98024d6-74db-4690-8eaa-849028adf1c9	1	t	f	a93de03c-82bd-4811-b630-afe737b02074
8347b7d2-6403-4d1d-b7ca-7140c9bdcbd4	2023-12-04 12:21:10.443524	2023-12-04 12:21:10.443524	\N	\N	pay 2	3000	2023-12-12	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
be98286a-cc4e-4007-a52c-6bec3f1d9e8f	2023-10-06 09:52:33.021692	2023-10-06 09:52:33.021692	\N	\N	payment 2	3214	2023-10-01	\N	t	e98024d6-74db-4690-8eaa-849028adf1c9	1	t	f	a93de03c-82bd-4811-b630-afe737b02074
5206978d-0bc5-44f8-9f9f-6ac1490ade21	2023-10-06 09:52:33.014593	2023-10-06 09:52:33.014593	\N	\N	Birr	1234	2023-10-15	\N	t	e98024d6-74db-4690-8eaa-849028adf1c9	7	f	f	1c543947-80cd-458a-a829-6c703b012f63
01a7b94e-2ffb-443c-ae75-b9124b1de7b9	2023-12-04 12:23:19.148981	2023-12-04 12:23:19.148981	\N	\N	pay 2	2000	2023-12-19	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	7	f	f	a93de03c-82bd-4811-b630-afe737b02074
03b75267-7c85-46ae-812b-96070fc1188a	2023-10-06 10:21:55.109386	2023-10-06 10:21:55.109386	\N	\N	payment 1	10000	2023-10-16	\N	t	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
53c6293a-b2b4-401b-a48c-b4c3ab2c731c	2023-10-06 10:21:55.110465	2023-10-06 10:21:55.110465	\N	\N	surafel office	10000	2023-10-23	\N	t	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	2	t	f	a93de03c-82bd-4811-b630-afe737b02074
5b8f5f86-73d0-44a9-8472-abe97f0ad92a	2023-12-04 12:30:12.969766	2023-12-04 12:30:12.969766	\N	\N	pay 2	3000	2023-12-13	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
4b53566e-7869-4b29-865a-4cd37cb70b4f	2023-12-04 12:32:05.120928	2023-12-04 12:32:05.120928	\N	\N	pay 12	3000	2023-12-12	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1	t	f	a93de03c-82bd-4811-b630-afe737b02074
a906fadf-9f17-4994-a4fa-517d0e3c1286	2023-12-04 12:38:15.712772	2023-12-04 12:38:15.712772	\N	\N	pay2222	3000	2023-12-13	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
4f18bc17-7483-46b6-ae0e-8cabc43c04e5	2023-12-04 12:39:45.474559	2023-12-04 12:39:45.474559	\N	\N	pay 15678	3000	2023-12-12	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1	t	f	1c543947-80cd-458a-a829-6c703b012f63
8ba0b4c5-2b5e-4e84-b18a-9170077e1d1a	2023-12-04 12:39:45.480097	2023-12-04 12:39:45.480097	\N	\N	pay 133333333333	2000	2023-12-12	\N	t	168da302-8bf6-4b1d-8126-e329fbf1b2e9	7	f	f	a93de03c-82bd-4811-b630-afe737b02074
8e79540d-b637-4095-92b0-abbe7b7dcdec	2023-10-05 19:07:45.506734	2023-10-05 19:07:45.506734	\N	\N	maisdnc	100000000	2023-10-16	\N	t	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	7	f	f	a93de03c-82bd-4811-b630-afe737b02074
\.


--
-- Data for Name: project_contract_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_contract_values (id, "createdAt", "updatedAt", "createdBy", "updatedBy", amount, "projectId", "currencyId") FROM stdin;
f48259b6-8d24-445b-b582-484d2740693c	2023-09-05 08:12:46.864376	2023-09-05 08:12:46.864376	\N	\N	100000000	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	7
c4702ac2-cacf-47cf-9100-2757e1af7ed7	2023-09-05 08:12:46.864376	2023-09-05 08:12:46.864376	\N	\N	100000	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	1
12c6a3a2-5b1e-4cca-86fc-b5ecd3aea76e	2023-09-05 11:05:26.903133	2023-09-05 11:05:26.903133	\N	\N	10000	b121be11-cbcc-41b0-89e4-8e4a289d04b0	7
d5ba536d-4b3e-4357-a5b1-e7a2525effd0	2023-09-05 11:05:26.903133	2023-09-05 11:05:26.903133	\N	\N	2000	b121be11-cbcc-41b0-89e4-8e4a289d04b0	1
34ab2051-1f61-41ff-9915-e9a1aa73197f	2023-09-05 16:29:25.481042	2023-09-05 16:29:25.481042	\N	\N	1234	21351d69-2f54-451e-978c-c487dc43cc59	3
f6a460e5-1e01-4a9b-9f5a-78d9b38a00e0	2023-09-05 16:29:25.481042	2023-09-05 16:29:25.481042	\N	\N	432321	21351d69-2f54-451e-978c-c487dc43cc59	1
9398469f-9c55-4de7-b3b0-932e8cc21701	2023-09-05 16:32:13.490379	2023-09-05 16:32:13.490379	\N	\N	1234	b7029129-ce20-4b1e-92de-a08b522379c5	7
a97b2351-78ef-41bf-aff9-04a4f2f0f1b3	2023-09-05 16:32:13.490379	2023-09-05 16:32:13.490379	\N	\N	8765	b7029129-ce20-4b1e-92de-a08b522379c5	1
ab209dd6-5d7d-44a4-989f-9e6732198218	2023-09-05 17:12:38.901871	2023-09-05 17:12:38.901871	\N	\N	100000	1a946cd8-4917-4499-837a-33291189b67c	1
4e041aae-0b98-4847-870b-f465206933bd	2023-09-05 17:12:38.901871	2023-09-05 17:12:38.901871	\N	\N	100000	1a946cd8-4917-4499-837a-33291189b67c	1
a47a0227-694f-4c70-ac05-dbe956f0526a	2023-09-05 17:12:57.81868	2023-09-05 17:12:57.81868	\N	\N	100000	0ad96685-c929-4f27-a065-52186fe74f89	1
8b9ea5dc-69d5-4994-a055-590dcff2e0e5	2023-09-05 17:12:57.81868	2023-09-05 17:12:57.81868	\N	\N	100000	0ad96685-c929-4f27-a065-52186fe74f89	1
87ef377d-213b-44ee-a0b4-b2c901063664	2023-09-05 17:13:19.390682	2023-09-05 17:13:19.390682	\N	\N	100000	285eaee5-069a-4385-888c-6a5274237475	1
24559d69-0253-4b7f-8876-6e0f2f805403	2023-09-05 17:13:19.390682	2023-09-05 17:13:19.390682	\N	\N	100000	285eaee5-069a-4385-888c-6a5274237475	1
eff536fe-6666-45bb-a347-f73b1c7c42d3	2023-09-05 17:14:34.812677	2023-09-05 17:14:34.812677	\N	\N	100000	277b3a35-660d-4311-915d-c7eedc8c736e	1
fa52bacb-6e94-4042-bf2c-bc31f7369dbc	2023-09-05 17:14:34.812677	2023-09-05 17:14:34.812677	\N	\N	100000	277b3a35-660d-4311-915d-c7eedc8c736e	1
dc11dc03-dfec-40e5-af15-9a60053d63c7	2023-09-11 09:32:43.049157	2023-09-11 09:32:43.049157	\N	\N	10000	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	1
7e05a35a-9f1e-4464-8a55-0bef65dfd79f	2023-09-11 09:32:43.049157	2023-09-11 09:32:43.049157	\N	\N	10000	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	2
5a39cc84-70b6-4179-879f-ecf0f59dc3f7	2023-09-14 18:14:35.992844	2023-09-14 18:14:35.992844	\N	\N	1000000	20eb8a5a-6292-49e4-830f-877d76079e08	7
4df944ad-ff93-4759-905f-1cdc912344b7	2023-09-14 18:14:35.992844	2023-09-14 18:14:35.992844	\N	\N	50000	20eb8a5a-6292-49e4-830f-877d76079e08	1
0ae65b8d-cb92-4d1c-bf0e-05efa5a8de81	2023-09-14 18:25:43.253424	2023-09-14 18:25:43.253424	\N	\N	100000	889bd689-643d-45a7-af6f-289045e35321	1
83a0063f-24f7-49e7-9b93-d7797ec38bc2	2023-09-14 18:25:43.253424	2023-09-14 18:25:43.253424	\N	\N	2000000	889bd689-643d-45a7-af6f-289045e35321	7
e6c61dfd-c460-4651-acfb-e1b63cf5056f	2023-09-15 08:17:48.071724	2023-09-15 08:17:48.071724	\N	\N	1234	e98024d6-74db-4690-8eaa-849028adf1c9	7
4a0cc7c9-3f10-47cf-b4fe-718465c5290f	2023-09-15 08:17:48.071724	2023-09-15 08:17:48.071724	\N	\N	3214	e98024d6-74db-4690-8eaa-849028adf1c9	1
0b9b738c-49cb-4600-b382-4b64d37cdf78	2023-09-29 10:32:32.85498	2023-09-29 10:32:32.85498	\N	\N	1234	85f953e1-e7e0-45b3-80af-477647901303	4
696b3336-1a05-4ca8-8daa-0c9ef51df156	2023-10-12 10:07:42.881655	2023-10-12 10:07:42.881655	\N	\N	100000	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a	1
a9139998-5e6b-46cf-b0eb-7dc98bc854df	2023-10-12 10:07:42.881655	2023-10-12 10:07:42.881655	\N	\N	20000	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a	1
be46dc2c-86d1-4f6d-9189-42e7057fcb2e	2023-12-03 22:44:34.896482	2023-12-03 22:44:34.896482	\N	\N	10000	166fcd53-fc7c-4674-bb41-af8024903940	1
71d3fb18-4f6f-420c-b11d-b8dadc7dfcd1	2023-12-03 22:44:34.896482	2023-12-03 22:44:34.896482	\N	\N	20000000	166fcd53-fc7c-4674-bb41-af8024903940	7
dd8d3e98-c8b3-4a6e-9a85-b14e66c62e93	2023-12-04 07:42:31.023229	2023-12-04 07:42:31.023229	\N	\N	23000	2bb68de0-26c4-489e-8bda-160f9e8858ec	3
9d86c8b1-0629-4b1b-b7d9-2221f0fef356	2023-12-04 07:42:31.023229	2023-12-04 07:42:31.023229	\N	\N	2000	2bb68de0-26c4-489e-8bda-160f9e8858ec	5
c2d80ec4-1cae-460f-bb16-9fd2b24c89d0	2023-12-04 11:46:59.834911	2023-12-04 11:46:59.834911	\N	\N	2000	51987d7f-ff1d-4e32-b205-4e43751e6ef0	7
fe676253-2edb-4415-8505-1de1c59dc9fe	2023-12-04 11:46:59.834911	2023-12-04 11:46:59.834911	\N	\N	4000	51987d7f-ff1d-4e32-b205-4e43751e6ef0	1
a2e24ba5-e6bb-4c39-b66b-f88604a62820	2023-12-04 11:48:51.741631	2023-12-04 11:48:51.741631	\N	\N	3000	168da302-8bf6-4b1d-8126-e329fbf1b2e9	1
53e8ed18-7bff-4601-8a0e-f423fd35f0ed	2023-12-04 11:48:51.741631	2023-12-04 11:48:51.741631	\N	\N	2000	168da302-8bf6-4b1d-8126-e329fbf1b2e9	7
dacd8e6a-eb1a-475e-ba19-6de7e03aac40	2023-12-04 14:14:34.436896	2023-12-04 14:14:34.436896	\N	\N	120000	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	7
5345d48c-276f-4d31-b4c8-d4316f257cc0	2023-12-04 14:14:34.436896	2023-12-04 14:14:34.436896	\N	\N	10000	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	1
\.


--
-- Data for Name: project_member; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_member ("userId", "projectId", "roleId") FROM stdin;
86951d22-4071-4d82-8129-ee7a5f301cf2	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
33465d05-1fd6-4d57-9690-8650773201b4	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
4bd73d59-b981-45b9-a152-638c43f3c43d	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
692d6491-191d-4582-aa95-918c621d20f5	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
e60e2dd6-a0f4-4c67-b8c6-a37462a6ab06	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
3e02ba82-eef4-4c88-8acc-b6cf8c09c956	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
9e9d2642-5a21-48a0-aca6-2dfa6abcfb18	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
3a464d46-a7ae-4f38-8635-dc1bc18761f9	b121be11-cbcc-41b0-89e4-8e4a289d04b0	\N
3bb205b8-afda-4492-970a-65321050b4b3	21351d69-2f54-451e-978c-c487dc43cc59	\N
471a616d-043b-4049-8d11-9330d41ab0b2	21351d69-2f54-451e-978c-c487dc43cc59	\N
3a464d46-a7ae-4f38-8635-dc1bc18761f9	b7029129-ce20-4b1e-92de-a08b522379c5	\N
5a53895e-a8c8-49f7-a353-780b3ab2209d	b7029129-ce20-4b1e-92de-a08b522379c5	\N
00293834-0050-41ec-a0a6-0bee2a1539c0	1a946cd8-4917-4499-837a-33291189b67c	\N
00293834-0050-41ec-a0a6-0bee2a1539c0	0ad96685-c929-4f27-a065-52186fe74f89	\N
00293834-0050-41ec-a0a6-0bee2a1539c0	285eaee5-069a-4385-888c-6a5274237475	\N
00293834-0050-41ec-a0a6-0bee2a1539c0	277b3a35-660d-4311-915d-c7eedc8c736e	\N
83c71fea-d35f-4e14-a017-6ad6851d2802	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	\N
75186c0d-08ac-4442-8cab-9dd84bef8455	49d8d741-497b-43d4-84fe-fdbaafd4cd5a	\N
a599dc30-6e74-4874-9413-34ce6b235944	20eb8a5a-6292-49e4-830f-877d76079e08	\N
92b3439d-2895-4dcd-b4d1-16e981e5e1f5	20eb8a5a-6292-49e4-830f-877d76079e08	\N
92b3439d-2895-4dcd-b4d1-16e981e5e1f5	889bd689-643d-45a7-af6f-289045e35321	\N
3bb205b8-afda-4492-970a-65321050b4b3	889bd689-643d-45a7-af6f-289045e35321	\N
5a53895e-a8c8-49f7-a353-780b3ab2209d	7e5d7b0b-7ae8-49f3-a0ef-e9df867e6cb9	\N
3a464d46-a7ae-4f38-8635-dc1bc18761f9	abc2499a-0ec0-4e3f-baa2-ec6b4831731f	\N
86951d22-4071-4d82-8129-ee7a5f301cf2	e98024d6-74db-4690-8eaa-849028adf1c9	\N
33465d05-1fd6-4d57-9690-8650773201b4	e98024d6-74db-4690-8eaa-849028adf1c9	\N
692d6491-191d-4582-aa95-918c621d20f5	e98024d6-74db-4690-8eaa-849028adf1c9	\N
ce889e57-f63f-41bb-9262-e8eecc7a3996	e00703d7-d40a-4138-a3d0-b69ae81033d3	\N
3a464d46-a7ae-4f38-8635-dc1bc18761f9	a6e584c4-74e3-4d4c-a068-3bceb1870605	\N
5a53895e-a8c8-49f7-a353-780b3ab2209d	a6e584c4-74e3-4d4c-a068-3bceb1870605	\N
3a464d46-a7ae-4f38-8635-dc1bc18761f9	7dcfd28d-0e14-45c2-930a-f8fe15f10196	\N
5a53895e-a8c8-49f7-a353-780b3ab2209d	7dcfd28d-0e14-45c2-930a-f8fe15f10196	\N
5a53895e-a8c8-49f7-a353-780b3ab2209d	261026b3-ae9b-4662-b24b-39fdaeea59f3	\N
3a464d46-a7ae-4f38-8635-dc1bc18761f9	261026b3-ae9b-4662-b24b-39fdaeea59f3	\N
022cd2f1-d84e-4613-b236-b862756b374a	85f953e1-e7e0-45b3-80af-477647901303	\N
04cf243a-28d0-43c4-b8dd-a9eb252b5947	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
00592b61-4639-4eba-a374-766147ce5c0f	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	\N
e3e98f6e-e20c-4b24-9983-291c42e1e193	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a	\N
e3e98f6e-e20c-4b24-9983-291c42e1e193	21351d69-2f54-451e-978c-c487dc43cc59	\N
fb676481-e015-484d-bc44-b006f9cf489b	166fcd53-fc7c-4674-bb41-af8024903940	\N
3061ef54-3d24-4cd7-9a93-1f631f811c67	166fcd53-fc7c-4674-bb41-af8024903940	\N
7b1dda68-c4f4-403d-bf85-aaad6bbf8bd5	166fcd53-fc7c-4674-bb41-af8024903940	\N
6d2e50d0-7093-4f2d-9d96-8293f8832556	2bb68de0-26c4-489e-8bda-160f9e8858ec	\N
8f63480a-84a9-41df-994e-d67f8d7bc0a9	51987d7f-ff1d-4e32-b205-4e43751e6ef0	\N
3061ef54-3d24-4cd7-9a93-1f631f811c67	168da302-8bf6-4b1d-8126-e329fbf1b2e9	\N
08a56d82-2c87-45f1-8027-af5b2f2e0688	168da302-8bf6-4b1d-8126-e329fbf1b2e9	\N
5a53895e-a8c8-49f7-a353-780b3ab2209d	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	\N
7363c810-b7c0-4bc7-b42e-6d3db63c38f6	fe5ff3b6-2e2d-4702-a371-1a06e896ccab	\N
5a53895e-a8c8-49f7-a353-780b3ab2209d	b121be11-cbcc-41b0-89e4-8e4a289d04b0	\N
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, "createdAt", "updatedAt", "createdBy", "updatedBy", name, "clientId", milestone, budget, contract_sign_date, planned_end_date, lc_opening_date, advanced_payment_date, status, "isOffice") FROM stdin;
21351d69-2f54-451e-978c-c487dc43cc59	2023-09-05 16:29:25.392071	2023-09-05 16:29:25.392071	\N	\N	test	\N	2	12432	2023-09-05	2023-09-05	2023-09-07	2023-09-07	t	f
b7029129-ce20-4b1e-92de-a08b522379c5	2023-09-05 16:32:13.41474	2023-09-05 16:32:13.41474	\N	\N	Test two	\N	5	567	2023-09-06	2023-09-12	2023-09-19	2023-09-13	t	f
1a946cd8-4917-4499-837a-33291189b67c	2023-09-05 17:12:38.869652	2023-09-05 17:12:38.869652	\N	\N	KIrubel Arch	\N	4	1000000	2023-08-14	2023-08-14	2023-08-14	2023-08-14	t	f
0ad96685-c929-4f27-a065-52186fe74f89	2023-09-05 17:12:57.798604	2023-09-05 17:12:57.798604	\N	\N	KIrubel Arch	\N	4	1000000	2023-08-14	2023-08-14	2023-08-14	2023-08-14	t	f
285eaee5-069a-4385-888c-6a5274237475	2023-09-05 17:13:19.367737	2023-09-05 17:13:19.367737	\N	\N	KIrubel Arch	\N	4	1000000	2023-08-14	2023-08-14	2023-08-14	2023-08-14	t	f
277b3a35-660d-4311-915d-c7eedc8c736e	2023-09-05 17:14:34.791419	2023-09-05 17:14:34.791419	\N	\N	KIrubel Arch	\N	4	1000000	2023-08-14	2023-08-14	2023-08-14	2023-08-14	t	f
20eb8a5a-6292-49e4-830f-877d76079e08	2023-09-14 18:14:35.939745	2023-09-14 18:14:35.939745	\N	\N	Enat Bank	\N	15	100000	2023-09-19	2023-09-26	2023-09-28	2023-10-07	t	f
889bd689-643d-45a7-af6f-289045e35321	2023-09-14 18:25:43.218265	2023-09-14 18:25:43.218265	\N	\N	Kirubel proj	\N	15	1000000	2023-09-06	2023-09-16	2023-09-19	2023-09-28	t	f
7e5d7b0b-7ae8-49f3-a0ef-e9df867e6cb9	2023-09-14 18:35:59.419916	2023-09-14 18:35:59.419916	\N	\N	surafel office	\N	\N	\N	\N	\N	\N	\N	t	t
abc2499a-0ec0-4e3f-baa2-ec6b4831731f	2023-09-14 18:37:07.475592	2023-09-14 18:37:07.475592	\N	\N	Kirubel office	\N	\N	\N	\N	\N	\N	\N	t	t
e98024d6-74db-4690-8eaa-849028adf1c9	2023-09-15 08:17:47.936916	2023-09-15 08:17:47.936916	\N	\N	AAIT	\N	5	12345	2023-09-15	2023-12-15	2023-09-15	2023-09-16	t	f
e00703d7-d40a-4138-a3d0-b69ae81033d3	2023-09-18 14:08:32.163398	2023-09-18 14:08:32.163398	\N	\N	office	\N	\N	\N	\N	\N	\N	\N	t	t
a6e584c4-74e3-4d4c-a068-3bceb1870605	2023-09-20 08:37:54.156534	2023-09-20 08:37:54.156534	\N	\N	Test One	\N	\N	\N	\N	\N	\N	\N	t	t
7dcfd28d-0e14-45c2-930a-f8fe15f10196	2023-09-20 08:40:09.127797	2023-09-20 08:40:09.127797	\N	\N	Test Budget	\N	\N	\N	\N	\N	\N	\N	t	t
261026b3-ae9b-4662-b24b-39fdaeea59f3	2023-09-20 08:51:22.16458	2023-09-20 08:51:22.16458	\N	\N	Test Budget one	\N	\N	\N	\N	\N	\N	\N	t	t
85f953e1-e7e0-45b3-80af-477647901303	2023-09-29 10:32:32.685868	2023-09-29 10:32:32.685868	\N	\N	dummy-service	285c68de-bb2e-4376-abaa-5da2f8fc5f40	5	12345	2023-09-19	2023-09-04	2023-09-07	2023-10-07	t	f
9ce6d120-f355-4d51-8fd9-fb037274be07	2023-11-01 09:37:29.377095	2023-11-01 09:37:29.377095	\N	\N	test edit project	1fb61f8e-f9dc-4405-8d38-c9e11ed6b1e1	2	123	2023-11-22	2023-11-25	2023-11-23	2023-11-29	t	f
b7c5baa3-31fb-4efe-b8fc-458ce1fb632a	2023-10-12 10:07:42.744619	2023-10-12 10:07:42.744619	\N	\N	updated project betty	17b991a5-664f-4034-adbe-141451fbb3bc	5	123	2023-10-18	2023-10-26	2023-10-27	2023-11-01	t	f
49d8d741-497b-43d4-84fe-fdbaafd4cd5a	2023-09-11 09:32:42.892025	2023-09-11 09:32:42.892025	\N	\N	project project	\N	5	12	2023-09-13	2023-09-13	2023-09-05	2023-09-14	f	f
b121be11-cbcc-41b0-89e4-8e4a289d04b0	2023-09-05 11:05:26.79795	2023-09-05 11:05:26.79795	\N	\N	ERA MOTI	\N	5	1000	2023-09-13	2023-11-30	2023-09-30	2023-09-30	t	f
7eba6dd1-4188-41c8-b1d2-63e8b82f8c41	2023-09-05 08:12:46.746676	2023-09-05 08:12:46.746676	\N	\N	Demo Project	\N	5	100000	2023-09-05	2023-11-23	2023-09-06	2023-09-06	f	f
166fcd53-fc7c-4674-bb41-af8024903940	2023-12-03 22:44:34.844435	2023-12-03 22:44:34.844435	\N	\N	project 1	17b991a5-664f-4034-adbe-141451fbb3bc	5	123	2023-12-12	2023-12-21	2023-12-14	2023-12-13	t	f
2bb68de0-26c4-489e-8bda-160f9e8858ec	2023-12-04 07:42:30.845957	2023-12-04 07:42:30.845957	\N	\N	jhkasyoauoa	17b991a5-664f-4034-adbe-141451fbb3bc	3	123	2023-12-20	2023-12-30	2023-12-27	2023-12-21	t	f
51987d7f-ff1d-4e32-b205-4e43751e6ef0	2023-12-04 11:46:59.789207	2023-12-04 11:46:59.789207	\N	\N	rabbit test	1fb61f8e-f9dc-4405-8d38-c9e11ed6b1e1	3	123	2023-12-05	2023-12-29	2023-12-19	2023-12-21	t	f
168da302-8bf6-4b1d-8126-e329fbf1b2e9	2023-12-04 11:48:51.708827	2023-12-04 11:48:51.708827	\N	\N	rabbit test 2	32c5766d-4a72-42ea-be38-9a5d15d2717d	3	123	2023-12-05	2023-12-29	2023-12-12	2023-12-21	t	f
912a1469-5506-4e45-96f3-340c98d5e2a2	2023-12-04 14:10:03.190949	2023-12-04 14:10:03.190949	\N	\N	Demo Project session	012bdd24-3286-4670-9b82-70f6ef664b25	3	123	2023-12-30	2024-01-30	2023-12-31	2024-01-05	t	f
bfecb77d-056c-4fa1-9a18-686475361703	2023-12-04 14:12:33.838354	2023-12-04 14:12:33.838354	\N	\N	AUC Apple Rediggton	17b991a5-664f-4034-adbe-141451fbb3bc	3	123	2023-12-30	2024-01-29	2024-01-01	2024-01-06	t	f
fe5ff3b6-2e2d-4702-a371-1a06e896ccab	2023-12-04 14:14:34.406929	2023-12-04 14:14:34.406929	\N	\N	Checking Project	012bdd24-3286-4670-9b82-70f6ef664b25	3	123	2023-12-05	2024-01-30	2023-12-12	2023-12-30	t	f
\.


--
-- Data for Name: relatedissues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.relatedissues (id, "createdAt", "updatedAt", "createdBy", "updatedBy", name, "afterActionAnalysisId") FROM stdin;
07228aff-4dd8-4880-9c72-c3cb54856add	2023-10-26 09:49:50.681719	2023-10-26 09:49:50.681719	\N	\N	Licence Renewal	7a7034dc-6d7a-4873-ac23-9c356aa7d4e0
\.


--
-- Data for Name: resourcehistories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resourcehistories (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "Action", "projectId", "taskId", "userId") FROM stdin;
\.


--
-- Data for Name: risks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risks (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "riskDescription", "causedBy", consequences, "riskOwner", status, "controlOwner", control, probability, impact, "riskRate", "residualProbability", "residualImpact", "residualRiskRate", "projectId") FROM stdin;
b58bd973-56ca-4788-b1c5-f2b3c7c0c6d6	2023-10-17 08:52:22.870602	2023-10-17 08:52:22.870602	\N	\N	New rizzz	sdfghjklasdfg	asdfgfds	Risk Owner	Transfered	adsklfjlk	rtrtrtrt	Medium	Low	Moderate	High	High	Critical	1a946cd8-4917-4499-837a-33291189b67c
dd3bb3a2-eea1-4c63-9e29-412d1b7a1c57	2023-10-17 09:07:37.636916	2023-10-17 09:07:37.636916	\N	\N	Issue on materials	Cause by	asdfgfds	Risk Owner	Open	fghjh	rtrtrtrt	Low	Very-High	Critical	High	Very-High	Critical	1a946cd8-4917-4499-837a-33291189b67c
36e0aad3-c70c-438c-9fc1-b450395031ee	2023-09-05 11:36:47.167052	2023-09-05 11:36:47.167052	\N	\N	Description	Caused By	Consequences	Nana	Transfered	Controll Owner	Transfered	High	High	Critical	Medium	High	Severe	b121be11-cbcc-41b0-89e4-8e4a289d04b0
9e672766-ea8a-4349-91d0-168dd92f62db	2023-09-14 19:33:51.01474	2023-09-14 19:33:51.01474	\N	\N	New Issue	Cause by	asdfgfds	Nana	Open	n	Transfered	Medium	Medium	Moderate	High	High	Critical	889bd689-643d-45a7-af6f-289045e35321
a8c3ef1d-f990-4631-9ea1-bba129da7c46	2023-09-14 19:33:57.629101	2023-09-14 19:33:57.629101	\N	\N	New Issueeeeeeeeee	Cause by	asdfgfds	Nana	Transfered	n	Transfered	Medium	Medium	Moderate	High	High	Critical	889bd689-643d-45a7-af6f-289045e35321
dff6d9df-6f86-4c4f-a1a3-241ca651e1ee	2023-09-14 19:25:04.511492	2023-09-14 19:25:04.511492	\N	\N	New Issue	asjd ck	akjnsdkj	aoiwnedcjna	Transfered	Risk Owner	Mitigated	Low	High	Severe	Medium	Medium	Moderate	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
0588b631-2218-4d87-8e5e-e2ad74eb55c4	2023-09-20 15:11:14.266905	2023-09-20 15:11:14.266905	\N	\N	Risk Description	cause	Consequences	Kirubel	Closed	adsklfjlk	Transfered	High	Very-High	Critical	High	High	Critical	b121be11-cbcc-41b0-89e4-8e4a289d04b0
f223af24-26bc-455b-aa24-2b7a4fa9637d	2023-09-20 15:14:10.81247	2023-09-20 15:14:10.81247	\N	\N	New Issue	Cause by	asdfgfds	Nana	Transfered	adsklfjlk	Mitigated	Medium	Medium	Moderate	Medium	Medium	Moderate	b121be11-cbcc-41b0-89e4-8e4a289d04b0
d7f72ed7-d982-4de1-bda6-e2960b3630ab	2023-09-15 09:52:44.837566	2023-09-15 09:52:44.837566	\N	\N	Risk Description	reason	Consequences	Kirubel	Transfered	fd	Mklkdlsajlkfj	High	High	Critical	High	High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
08e8fa9a-b6c4-466e-9bed-a9f641da5056	2023-09-25 10:37:42.645017	2023-09-25 10:37:42.645017	\N	\N	RIsk 	Cause	Conse	Nah	Closed	NNNeee	New COntroll Mechanism	High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
9538403b-c23c-48bd-8ee7-39d5dd2a16f1	2023-09-25 10:50:54.869875	2023-09-25 10:50:54.869875	\N	\N	Risk Risk	Cause	Conseq	sdaljflk	Transfered	asdf	sadfkj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
69b71c63-ba29-4c97-a117-a344bdc57005	2023-09-25 10:50:59.435096	2023-09-25 10:50:59.435096	\N	\N	Risk Risk	Cause	Conseq	sdaljflk	Closed	asdf	sadfkj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
15cf3768-887c-4f7d-99a2-8a6f80135537	2023-09-25 10:50:58.678417	2023-09-25 10:50:58.678417	\N	\N	Risk Risk	Cause	Conseq	sdaljflk	Closed	asdf	sadfkj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
2312923b-d221-43fb-be51-410504b236cf	2023-09-25 11:57:09.383996	2023-09-25 11:57:09.383996	\N	\N	New RIsk	Caos	COmnsq	Nanq	Closed	sdaklfj	asdkfjkl	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
46b935ca-95e1-480b-baf0-60634dbd07e4	2023-09-25 12:03:51.474247	2023-09-25 12:03:51.474247	\N	\N	asdklfjlsadf	lksdlkfj	lksdjflkj	sdakfj	Closed	sdalkfj	sdklfj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
8e24addb-775d-4968-b306-2377722556de	2023-09-25 12:03:47.411394	2023-09-25 12:03:47.411394	\N	\N	asdklfjlsadf	lksdlkfj	lksdjflkj	sdakfj	Closed	sdalkfj	sdklfj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
233bac0c-4393-490f-8f44-471025575078	2023-09-25 12:22:49.108862	2023-09-25 12:22:49.108862	\N	\N	RIsk	Caaa	Cons	asldjf	Open	sdf	asdfkj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
3b5fbf8e-0944-4ba7-8c2c-3c8f83d9406c	2023-09-25 12:22:49.826361	2023-09-25 12:22:49.826361	\N	\N	RIsk	Caaa	Cons	asldjf	Open	sdf	asdfkj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
12318a31-0619-448a-bf63-e71ebe38d3a3	2023-09-25 12:22:52.495586	2023-09-25 12:22:52.495586	\N	\N	RIsk	Caaa	Cons	asldjf	Closed	sdf	asdfkj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
8c78623d-f849-4524-a086-5fe88f93661b	2023-09-26 16:52:41.496515	2023-09-26 16:52:41.496515	\N	\N	Issue Test 	Betty	Delay	betty	Transfered	betty	Mitigated	Medium	Medium	Moderate	Medium	High	Severe	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
1769a0f8-3dc6-47b0-b186-10d6e5d64177	2023-09-05 08:55:36.04053	2023-09-05 08:55:36.04053	\N	\N	Delay on CISCO switch delivery	delay	schedule extension updated	Kirubel	Transfered	adsklfjlk	Transfered	High	High	Critical	High	Medium	Severe	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
df2924c1-a5d6-4de1-874c-573ddcc18002	2023-10-12 09:06:38.32954	2023-10-12 09:06:38.32954	\N	\N	NEw Risk	cause	conseq	Nah	Closed	nah	constrolls	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
fe4fa268-ec1a-4ed3-be10-687e89861c2c	2023-10-12 10:32:37.183623	2023-10-12 10:32:37.183623	\N	\N	test risk	Betty	Delay	betty	Transfered	jghghgy	Avoided	Low	Very-High	Critical	Low	Medium	Moderate	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a
852ea911-6d05-4013-8f75-cfdd08305e07	2023-11-01 17:20:37.030182	2023-11-01 17:20:37.030182	\N	\N	Risk 	nA	LKJASDLKFJ	ASDFGASDF	Transfered	ASFDASDFQ	ASDFDS	Very-High	Very-High	Critical	Very-High	Very-High	Critical	b121be11-cbcc-41b0-89e4-8e4a289d04b0
336b7cab-8202-4528-8b8b-6959fc9ad931	2023-10-12 10:37:24.103878	2023-10-12 10:37:24.103878	\N	\N	hiwi test 	Betty	Delay	betty	Closed	betty	Mitigated	Very-High	High	Critical	High	Medium	Severe	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a
46fd529b-f3a2-4c05-8065-45d322fb58f1	2023-10-12 10:37:46.268148	2023-10-12 10:37:46.268148	\N	\N	hiwi test 2	Betty	Delay	betty	Closed	betty	Mitigated	Very-High	High	Critical	High	Medium	Severe	b7c5baa3-31fb-4efe-b8fc-458ce1fb632a
7d8b9157-e592-42e8-88e4-a2119999c359	2023-10-13 08:16:13.287531	2023-10-13 08:16:13.287531	\N	\N	New Issue	Cause by	COnseq	Nana	Closed	hiyaaaaaaaaaaaaaaa	controllerrrreajskdcaksdccasdcjaskcllasdcasodc	Very-High	Very-High	Critical	High	High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
965a60ce-30e6-4a52-bdea-2b328ecae281	2023-10-17 08:45:45.605518	2023-10-17 08:45:45.605518	\N	\N	New Riskkkkk	Cause by	COnseq	Kdirubel	Closed	adsklfjlk	rtrtrtrt	Very-High	Very-High	Critical	Very-High	Very-High	Critical	1a946cd8-4917-4499-837a-33291189b67c
d1ba10cd-2978-4ca6-ab45-2899cb90728e	2023-09-25 12:22:46.83894	2023-09-25 12:22:46.83894	\N	\N	RIsk	Caaa	Cons	asldjf	Transfered	sdf	asdfkj	Very-High	Very-High	Critical	Very-High	Very-High	Critical	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
04041867-3025-48c4-831c-834f576d7823	2023-11-02 09:15:15.047777	2023-11-02 09:15:15.047777	\N	\N	Resource constraint	Daynamic evt	high	Daniel	Transfered	Nahi	Transfer	High	High	Critical	Medium	Medium	Moderate	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
f827301d-9d0e-4a8d-a3cd-b9eeef9f2b16	2023-12-04 15:28:54.657414	2023-12-04 15:28:54.657414	\N	\N	Issue description	Reason	damage	surafel kifle	Closed	surafel	Transfered	Very-High	Very-High	Critical	High	Medium	Severe	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
9b4f945c-d9c6-4f05-ae12-3d8bcb48fb68	2023-12-04 15:35:06.379399	2023-12-04 15:35:06.379399	\N	\N	Issue descriptionbj	Reason	damage	surafel kifle	Transfered	surafel	Transfered	High	Low	Moderate	Very-High	High	Critical	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
16683e1b-9f95-4e71-8159-d4fa56b4911d	2023-12-04 15:35:07.526652	2023-12-04 15:35:07.526652	\N	\N	Issue descriptionbj	Reason	damage	surafel kifle	Transfered	surafel	Transfered	High	Low	Moderate	Very-High	High	Critical	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, "createdAt", "updatedAt", "createdBy", "updatedBy", "roleName", "isProjectRole") FROM stdin;
018ebce9-c323-4fdc-906e-77f9c4b2edd6	2022-10-22 07:15:04	2022-10-22 07:15:04	\N	\N	Finance Manager	f
0c2a6eaa-9665-446f-8a8f-a9f5ace2a933	2023-08-17 13:18:12	2023-08-17 13:18:12	\N	\N	test role	f
0e324e94-6f2c-415c-9a46-a359a96fea7f	2022-10-22 06:54:03	2022-10-22 06:54:03	\N	\N	Project Finance Officer	t
161c43a8-64b1-4dad-ace5-a17f883cfe1d	2022-10-22 07:11:42	2022-10-22 07:11:42	\N	\N	Sourcing Officer TL	f
30a7cdd5-b525-49f6-ae7a-e07841305ff6	2022-10-22 07:13:20	2022-10-22 07:13:20	\N	\N	Logistics Officer	f
30ee1cee-10d4-48bd-92d0-0e1191a23c21	2023-01-21 14:48:39	2023-01-21 14:48:39	\N	\N	Store Keeper	f
378a9fb1-3f30-4dd1-90ed-0357149afa11	2022-10-22 06:49:44	2022-10-22 06:49:44	\N	\N	Production Manager	t
41104c1f-3e23-4a50-8e19-c92bb6164466	2022-10-22 07:13:43	2022-10-22 07:13:43	\N	\N	Production Manager	f
4eafb2fd-e9e4-40d0-8c87-a2a2b9c48c5f	2023-05-29 18:08:53	2023-05-29 18:08:53	\N	\N	PMOM	f
504b6b54-d549-4ca4-8dd5-8a779ea4cf40	2022-10-26 06:07:38	2022-10-26 06:07:38	\N	\N	Field Engineer	f
587f236d-46b3-4c35-8fb3-6dfd94a8a5af	2022-10-22 07:12:54	2022-10-22 07:12:54	\N	\N	Service Delivery Manager	f
5dbeddaf-3490-4151-9e80-303c70f18a10	2022-10-22 06:50:50	2022-10-22 06:50:50	\N	\N	Technical Leader	t
6b829425-8842-42c4-b68c-cc001a22985f	2022-10-22 06:51:13	2022-10-22 06:51:13	\N	\N	Logistics Officer	t
80de3aad-07ed-40fd-a185-6028cdf668ec	2022-10-22 07:14:47	2022-10-22 07:14:47	\N	\N	Project Finance Officer	f
856c5d9b-dce6-4930-9039-ea46e886eb34	2022-10-22 07:12:24	2022-10-22 07:12:24	\N	\N	Logistics TL	f
8593ce54-0abe-466e-8b58-928ec546cf7c	2022-10-22 06:53:15	2022-10-22 06:53:15	\N	\N	Field Engineer	t
962fbf27-01c7-4b77-80f7-aa2f39936c8d	2022-10-22 07:08:11	2022-10-22 07:08:11	\N	\N	CEO	f
96f8c153-79d5-40d1-b0b7-7fd70921f02e	2022-10-22 06:49:00	2022-10-22 06:49:00	\N	\N	Project Manager	t
a5967cbe-5019-4b15-bc13-b6503d658315	2022-10-22 07:11:25	2022-10-22 07:11:25	\N	\N	Project Manager	f
aac43506-4184-48a8-9873-a1849dc1d8ee	2022-10-22 07:07:46	2022-10-22 07:07:46	\N	\N	Super Admin	f
b678b3d7-5d5c-4754-956f-a7b9ebacb302	2022-10-22 06:49:20	2022-10-22 06:49:20	\N	\N	Sourcing Officer	t
cf315081-a97a-4fe1-80f4-b254a09e32a5	2022-10-22 07:12:05	2022-10-22 07:12:05	\N	\N	Sourcing Officer	f
d7b96aeb-563d-4744-8702-2a20f5a59144	2022-12-28 12:09:06	2022-12-28 12:09:06	\N	\N	Default Role	f
e9a6853a-90d0-41ac-aee1-90b04841ed22	2022-10-22 07:14:01	2022-10-22 07:14:01	\N	\N	DOO	f
66d7bce9-c323-4fdc-906e-77f9c4b2edd0	2023-11-30 11:40:22.787623	2023-11-30 11:40:22.787623	\N	\N	Controller	f
\.


--
-- Data for Name: subtasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subtasks (id, "createdAt", "updatedAt", "createdBy", "updatedBy", name, "plannedStart", "plannedFinish", "actualStart", "actualFinish", completion, "plannedCost", "actualCost", status, "sleepingReason", "taskId", predecessor) FROM stdin;
1b0c4ba5-e0b4-4128-a27c-167526ab2a9a	2023-12-04 12:08:02.220498	2023-12-04 12:08:02.220498	\N	\N	sub 1	2023-12-12	2023-12-14	\N	\N	0	\N	\N	t	\N	eca5f79b-3f94-43df-b066-52ac5c1b6a2e	
f523c7c8-e873-4218-ab7f-a3c22984e6eb	2023-12-04 12:08:02.223837	2023-12-04 12:08:02.223837	\N	\N	sub 2	2023-12-12	2023-12-18	\N	\N	0	\N	\N	t	\N	a5db711d-322a-44d6-8e47-322326397d7a	\N
ff422aab-3d75-4034-8a9c-7cb5c85768af	2023-12-04 12:08:02.234671	2023-12-04 12:08:02.234671	\N	\N	sub 3	2023-12-29	2024-01-04	\N	\N	0	\N	\N	t	\N	ccab49fe-b3b5-463c-826d-955dce9472dc	s1
a4029a91-d448-4f08-babb-b9823f1e576e	2023-12-04 14:39:05.775241	2023-12-04 14:39:05.775241	\N	\N	shipp one item	2023-12-11	2023-12-12	\N	\N	0	\N	\N	t	\N	846f3664-b597-4b9e-b6aa-c057fbe0dceb	
3c7483bc-9eec-447f-a81d-48cb6a436f23	2023-11-30 11:54:14.989584	2023-11-30 11:54:14.989584	\N	\N	nn	2023-11-29	2023-12-08	\N	\N	0	\N	\N	t	\N	6c34db3c-cba4-4b41-bbf7-46e2b5490b14	\N
38352095-85ac-45b0-ac35-b0406226f3dc	2023-11-30 11:54:15.010074	2023-11-30 11:54:15.010074	\N	\N	kk	2024-01-30	2024-01-30	\N	\N	0	\N	\N	t	\N	29f928df-bc64-45ba-8080-b6589271536a	\N
1ae66359-280d-4eef-908d-319b6ec6928f	2023-11-30 11:54:15.025937	2023-11-30 11:54:15.025937	\N	\N	m	2023-11-28	2023-11-28	\N	\N	0	\N	\N	t	\N	ef4bc3a9-745d-4eb6-b2da-c57bd6660ec1	\N
13161ac2-104a-4a97-92de-6bc70682801b	2023-11-30 11:54:15.03616	2023-11-30 11:54:15.03616	\N	\N	n	2024-01-15	2024-01-18	\N	\N	0	\N	\N	t	\N	124c8063-5132-46b9-abd4-de34b3ee390e	\N
bd00349c-1c38-4eea-b28b-179cd097f407	2023-11-30 11:54:15.031336	2023-11-30 11:54:15.031336	\N	\N	n	2024-02-01	2024-02-22	\N	\N	0	\N	\N	t	\N	d3817ac9-8236-4a18-af9c-ed3d726b3b45	\N
\.


--
-- Data for Name: taskUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."taskUser" ("taskId", "userId") FROM stdin;
0cdc3287-f398-4e29-ad37-798e45b00657	5a53895e-a8c8-49f7-a353-780b3ab2209d
846f3664-b597-4b9e-b6aa-c057fbe0dceb	fb676481-e015-484d-bc44-b006f9cf489b
eecec2d0-4162-4d5f-8590-a481002e9c1e	886deac5-d577-4184-a463-6b616816ec1f
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, "createdAt", "updatedAt", "createdBy", "updatedBy", name, "plannedStart", "plannedFinish", "actualStart", "actualFinish", completion, "plannedCost", "actualCost", status, "sleepingReason", "baselineId", "milestoneId", predecessor) FROM stdin;
eca5f79b-3f94-43df-b066-52ac5c1b6a2e	2023-12-04 12:08:02.192728	2023-12-04 12:08:02.192728	\N	\N	task 1	2023-12-05	2023-12-11	\N	\N	0	\N	\N	t	\N	334d1dfd-3fee-49e1-ba20-1a7e3ecc5c87	b7934c6c-a271-4e13-8565-66a91bfbb6fb	
a5db711d-322a-44d6-8e47-322326397d7a	2023-12-04 12:08:02.196277	2023-12-04 12:08:02.196277	\N	\N	task 2	2023-12-12	2023-12-28	\N	\N	0	\N	\N	t	\N	334d1dfd-3fee-49e1-ba20-1a7e3ecc5c87	b7934c6c-a271-4e13-8565-66a91bfbb6fb	0
ccab49fe-b3b5-463c-826d-955dce9472dc	2023-12-04 12:08:02.210414	2023-12-04 12:08:02.210414	\N	\N	task 3	2023-12-29	2024-01-18	\N	\N	0	\N	\N	t	\N	334d1dfd-3fee-49e1-ba20-1a7e3ecc5c87	90c40b16-ba25-463f-af81-cc503a113e87	1
990d0a66-7043-409b-b7db-7ee64677b05e	2023-12-04 12:08:02.223113	2023-12-04 12:08:02.223113	\N	\N	task 4	2023-12-29	2024-01-05	\N	\N	0	\N	\N	t	\N	334d1dfd-3fee-49e1-ba20-1a7e3ecc5c87	90c40b16-ba25-463f-af81-cc503a113e87	1
846f3664-b597-4b9e-b6aa-c057fbe0dceb	2023-12-04 14:39:05.741722	2023-12-04 14:39:05.741722	\N	\N	shippment	2023-12-11	2023-12-14	\N	\N	0	\N	\N	t	\N	8249baf7-d96c-414d-b770-7ca8a5e9a836	09ccbb10-2223-4420-ba9f-8e4e7b5c59e3	
eecec2d0-4162-4d5f-8590-a481002e9c1e	2023-12-04 14:39:05.738179	2023-12-04 14:39:05.738179	\N	\N	implimentation	2023-12-15	2024-01-10	\N	\N	0	\N	\N	t	\N	8249baf7-d96c-414d-b770-7ca8a5e9a836	858cbd7c-d67d-41e7-9d60-1b8b8ec4cfca	1
0cdc3287-f398-4e29-ad37-798e45b00657	2023-12-04 14:39:05.725316	2023-12-04 14:39:05.725316	\N	\N	order item	2023-12-05	2023-12-08	2023-12-20	\N	0	\N	\N	t	\N	8249baf7-d96c-414d-b770-7ca8a5e9a836	80bc2479-6cea-44ce-9622-528c4a981ddf	
6c34db3c-cba4-4b41-bbf7-46e2b5490b14	2023-11-30 11:54:14.958436	2023-11-30 11:54:14.958436	\N	\N	snss	2023-11-29	2023-12-08	\N	\N	0	\N	\N	t	\N	7e908b6a-27f5-4c38-9ec0-6b123943d081	41d45917-8f2f-476f-b03e-180b3b0d6751	\N
29f928df-bc64-45ba-8080-b6589271536a	2023-11-30 11:54:14.980299	2023-11-30 11:54:14.980299	\N	\N	mmm	2023-12-05	2024-01-30	\N	\N	0	\N	\N	t	\N	7e908b6a-27f5-4c38-9ec0-6b123943d081	31840152-e7e4-496b-97f9-2d96c665a8fb	\N
ef4bc3a9-745d-4eb6-b2da-c57bd6660ec1	2023-11-30 11:54:14.988551	2023-11-30 11:54:14.988551	\N	\N	m	2023-11-24	2023-12-06	\N	\N	0	\N	\N	t	\N	7e908b6a-27f5-4c38-9ec0-6b123943d081	898f89aa-0d28-4bf3-b330-f020b5ce0242	\N
124c8063-5132-46b9-abd4-de34b3ee390e	2023-11-30 11:54:15.003882	2023-11-30 11:54:15.003882	\N	\N	mm	2023-12-08	2024-01-22	\N	\N	0	\N	\N	t	\N	7e908b6a-27f5-4c38-9ec0-6b123943d081	5bfddf14-2057-41dd-b3ba-dd19747ea95c	\N
d3817ac9-8236-4a18-af9c-ed3d726b3b45	2023-11-30 11:54:15.002087	2023-11-30 11:54:15.002087	\N	\N	m	2024-01-30	2024-05-29	\N	\N	0	\N	\N	t	\N	7e908b6a-27f5-4c38-9ec0-6b123943d081	361c4d40-4abd-40e2-91f3-d92c344a1ddf	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, "emailVerifiedAt", password, avatar, signature, "isDeleted", "rememberToken", "createdAt", "updatedAt", "roleId") FROM stdin;
00293834-0050-41ec-a0a6-0bee2a1539c0	Leul Fentaye	leul@ienetworksolutions.com	\N	$2y$10$uL422zPss1mbl07gu4KqB.GgXRwIaqLR4VN6SaNXZ0WJ6kW4rc..2	\N		f	\N	2022-10-26 06:09:29	2022-10-26 06:09:41	\N
00592b61-4639-4eba-a374-766147ce5c0f	Mulualem Eshetu	Mulualem@ienetworks.co	\N	$2y$10$bNSQTgXDG/PnbcIBACOe5uqCDL6z1VrMEa09KfmVKiPIkeJEDPhaq	/ProfilePictures/1667490464-IMG_20221103_184629_254.jpg		f	\N	2022-11-03 17:27:47	2022-11-03 22:47:44	\N
00bf1d57-8760-471d-8602-615abd7cd977	IE Support Ticket	help@ienetworksolutions.com	\N	$2y$10$03iRrG5R1pegIYwYTSbVjuPcNVpi5Z9w6A2Tqf0loscQwbaEh4lT2	\N		f	\N	2022-12-13 21:28:56	2023-06-13 14:07:08	\N
022cd2f1-d84e-4613-b236-b862756b374a	Kirubel Chane	kirubel.chane@ienetworksolutions.com	\N	$2y$10$G.I.V56OICJDdp3e64splufsCoLXZ/D0hny5Dj8/UXg1yreVaZc8i	\N	/signatures/1688123230-WhatsApp Image 2023-06-30 at 2.00.27 PM-PhotoRoom.png-PhotoRoom.png	f	\N	2023-01-06 16:17:46	2023-06-30 18:07:10	\N
04cf243a-28d0-43c4-b8dd-a9eb252b5947	Kiber Tenaw	kiber@ienetworks.co	\N	$2y$10$KnI53vKFleC3ZYCDKzMS9eWzNjM8sEynjs7iz/tlrHPRDyyP2rlEu	\N		f	\N	2022-12-29 19:42:06	2023-02-13 21:05:50	\N
08a56d82-2c87-45f1-8027-af5b2f2e0688	Tinsae Kidane	tinsae@ienetworks.co	\N	$2y$10$YWNwZ1Vq1p8Ro2phZMOuh.f80SZiV8tQiZRSstjS8MJZGVXZ9kZj2	\N	\N	f	\N	2023-06-09 14:46:03	2023-06-09 14:46:03	\N
0911accf-d376-4576-82d5-4cddb65c753c	Tsadkan  Yohannes	tsadkan@ienetworks.co	\N	$2y$10$ptm0eN9p9JkpQ1/lXXwJZuzLdmXrLkkpgn73pKOUYjg0vt.9XTJjW	\N		f	\N	2022-12-25 17:15:32	2022-12-25 17:15:32	\N
09403930-2f0f-4afa-ba12-636c73a2c966	Samuel Negash	samuel@ienetworks.co	\N	$2y$10$rPTf4jOFOzg5k.1P.tBKWeEARB6OyzwjlBwRYKyoooXUD3okPwpn.	\N		f	\N	2022-12-26 13:23:11	2023-08-14 13:34:33	\N
0949c8e8-66e4-4f4d-a4d9-25ac3604792d	Sisay Shiferaw	sisay.shiferaw@ienetworksolutions.com	\N	$2y$10$l5UpzO14a8sJbkd1Vu/QYeXQOr0RhJk/aAktBts50qWiZKmUBdv3e	\N		f	\N	2023-01-06 16:10:51	2023-01-06 16:10:51	\N
09e53caa-89ae-47ef-bdf1-2b3c527dd3de	Yordanos Adugna	yordanos.adugna@ienetworksolutions.com	\N	$2y$10$Knie/q7XxYcs3cm3RW8sD.pN/xKd8o0Bgr4v1a4/6BrqQz7h3OlTK	\N		f	\N	2023-02-20 20:07:13	2023-02-20 20:19:01	\N
0ac4cfcf-a3f4-4f91-b3e3-e23b192760d7	Biniyam Gidey	biniyam.gidey@ienetworksolutions.com	\N	$2y$10$ihBl78EC2186lITOktu0QOXg6QQWGz47RSHhCmzgniuZizixWIMlu	\N		f	\N	2023-01-30 15:02:06	2023-01-30 21:37:37	\N
0c738c29-a170-4153-8bd2-363b6cfbfda2	Mastweal Betigist	mastewal@ienetworks.co	\N	$2y$10$CegdHrPv3x9yFn3zASpTReFms.hO83rveOPnCoNNasr08YnRH2PzG	\N		f	\N	2022-10-27 11:42:00	2023-01-11 20:18:48	\N
0fb0849c-f669-44be-81d6-b54f25a581b9	Bete Zerihun	bete.zerihun@ienetworks.co	\N	$2y$10$ksGO0RId3cVQP1CVMNH0wuZK2axOH1COuDtEsHkhKFYnByFPqBv3K	\N	/signatures/1687276083-IMG_20230620_184323_158-removebg-preview.png	f	\N	2022-12-20 20:39:43	2023-06-20 22:48:03	\N
121cdca6-b99b-48c1-98ff-03e449eb9049	Mehader Mengistu	mehader.mengistu@ienetworksolutions.com	\N	$2y$10$OLZBqEvLSGl0qXic0aJ/EeI59MhdraMXfxUhtjw3t0mnhjROCq/8e	\N	/signatures/1686307026-CamScanner 06-09-2023 13.30_1.jpg	f	\N	2022-12-29 13:54:47	2023-06-09 17:37:06	\N
124e10bd-5a64-4b3a-8f07-c7469b956ca4	Kidist Tadesse	kidist.tadesse@ienetworksolutions.com	\N	$2y$10$853ibtlGl.1hbdeLQH1S0O7RG3u8XknuQZuaLCSM5NUAmNTvdRxzG	\N		f	\N	2023-02-02 22:10:20	2023-02-02 22:10:20	\N
12f61b8d-3a56-4ad8-bf6c-2ae778aec013	Meiraf Solomon	meiraf.solomon@ienetworksolutions.com	\N	$2y$10$8z8EeeiJ6UX4cqDaTgBCfezz9x0KybotwUFZmLLQbhcx5wZMJpyz6	\N	\N	f	\N	2023-07-28 15:12:12	2023-07-28 15:19:48	\N
141dc1b9-36c2-496e-966f-1e7a7e763cd7	Bezawit  T/Mariam	bezawit@ienetworks.co	\N	$2y$10$DI3.V3d18IqlCoc.KUg6Z.uR5wpKF.qCLNhxk2SrhoxUFHrnjyC1.	\N		f	\N	2023-01-04 13:16:32	2023-01-30 16:38:52	\N
190fe443-45ab-420b-b54e-10408a3a9e24	Robin Yehualashet	robin@ienetworks.co	\N	$2y$10$XPGAmD4.OB95d8GBOES8D.XWqVszeovz4J4nvR2JZX0oxpYW.2FQW	\N		f	\N	2022-12-30 16:24:40	2023-02-02 15:37:52	\N
2079755a-013d-400c-a181-9d216ad01827	Mesay Worku	Mesay@ienetworks.co	\N	$2y$10$oLMdG4vE0P9djZO804LuoeL22IPdX642sfZ6d7imHns/eCJVXBwGa	\N		f	\N	2022-12-12 16:15:33	2022-12-22 12:46:46	\N
21a7330c-6a57-41ec-9573-44fd31b354bc	Eyerusalem Assefa	Eyerusalem@ienetworks.co	\N	$2y$10$kU2EqbQtgT7eput0csjyiuI4eGtPwTWsP/2j2vrZ17f8CYdTOwvIa	\N		f	\N	2023-02-08 21:58:29	2023-03-20 17:57:07	\N
25e3ac8f-0ab4-4c1c-ba11-22bc38652a19	Natnael Hailemariam	natnael.h@ienetworksolutions.com	\N	$2y$10$sMsswwGrAE8ItbkL/E5qq..GBWPxtVRyqF5jmyWRcgu3xrpHZ9cp2	\N		f	\N	2023-01-27 14:03:28	2023-01-27 14:18:39	\N
25fee66b-f873-4e58-8053-e3dbfaec4238	Eyobed Tilaye	eyobed.t@ienetworks.co	\N	$2y$10$Cq9NIa4n/bjUVQsRsYHn8OtP7vEBLkiFzuTESyEopoJfKWQ3a3SGK	\N		f	\N	2022-11-07 12:18:04	2023-02-20 12:58:43	\N
261b4274-a0bb-461e-a005-eef51b1b3227	Abiy Mamushet	abiy@ienetworksolutions.com	\N	$2y$10$YroaQ8L/SgYyta/tuwwn3On7OjbUlkWe84yB.pcfTZfImz5AdxV/S	\N		f	\N	2022-10-22 04:16:04	2022-10-22 07:31:16	\N
263c0857-f746-4b9a-ad09-2f5e45a9f445	Michael Kassahun	michael.kassahun@ienetworks.co	\N	$2y$10$dWmZjNPd17fQujxMrSkbCue4kY.SIipUgL7c/ByMnxRLj.2HcaZgK	\N		f	\N	2022-12-30 19:30:04	2023-08-10 13:37:42	\N
2675736e-0b44-41ee-b27d-5e0d174edf1d	Ephrem Amognehegn	ephrem.amognehegn@ienetworksolutions.com	\N	$2y$10$0DDaHvbedlwrRhKolnyuJep/TOlYE5g4DsYc4rii.LMmKF3Ncl7Ci	\N		f	\N	2023-03-06 15:50:32	2023-04-05 20:43:38	\N
2987f9c9-f56e-41f6-91b8-f21d52478871	Kidist Baye	kidist@ienetworks.co	\N	$2y$10$Q8UYjT1JcyDYKxMWKaiAf.XEESZz9XtUV7FojXnXdXFVhLibcrVB6	\N	/signatures/1685980563-4_6048427706507333749_page-0001-removebg-preview (1).png	f	\N	2022-10-26 04:15:03	2023-06-05 22:56:03	\N
2994719d-ab8a-4580-a782-375de722ea01	Filimon Bekele	filimon.bekele@ienetworksolutions.com	\N	$2y$10$vquupY/Rq0FD0RgzEtxYUO5RngT.bbq6lVCQ/ErtnBP6ySljfur.a	\N	\N	f	\N	2023-06-15 10:03:11	2023-06-15 10:03:11	\N
2aad221f-af7a-4361-ba39-7da63463ebc3	Rodas Kasahun	rodas.kasahun@ienetworksolutions.com	\N	$2y$10$ye9V0nzHgyUStb3RJpBe3.R/fLmZpOwK/f0Fmpm4GeHx17TdfPq1C	\N		f	\N	2023-01-04 15:16:28	2023-01-04 15:20:58	\N
2dde543e-d99e-4bc9-bf0d-8cef84d4dcc1	Kirubel Simachew	Kirubel@ienetworks.co	\N	$2y$10$4itTeiSYOmTlAI2eNhFd/OCT9PFtX1Ga4LuKi68i3jbI5RsMtKxzG	/ProfilePictures/1666895511-600x600 (1).jpg	/signatures/1678777267-developing-cloud-applications-with-node-js-and-react.png	f	\N	2022-10-22 04:21:54	2023-03-14 14:01:07	\N
2e2e6753-15fc-4af9-a536-37c14f4e4b2d	Nardos Tsegaye	nardos@ienetworksolutions.com	\N	$2y$10$2DbsfCfSu.o7tKzcGtmxvuNPpf90oP5D4QO5wYKTfVCRfwQFXChAu	\N		f	\N	2022-11-03 18:53:33	2022-11-15 19:01:38	\N
2e6ad626-f1ee-4bda-b718-c865615dba73	Sibhat Solomon	sibhat.solomon@ienetworks.co	\N	$2y$10$7otsyO3x1rjLSBjM5yyBIeT9X8naElqMpJTodNGagZ0k6cb/Zepd6	\N		f	\N	2023-01-15 16:10:32	2023-01-15 16:10:32	\N
2e9bd9e1-70b2-46b3-bc40-d33d1012283a	Belete Demissie	belete.demissie@ienetworksolutions.com	\N	$2y$10$J8z7bgQL.uxthtYWSmS.huOZUjo/jABLIrX9Y.LYNZ4RV7C6JUFpS	\N	/signatures/1689602913-IMG_20230717_170042-removebg-preview.png	f	\N	2023-07-14 15:17:12	2023-07-17 21:08:33	\N
2f478e25-c173-4205-b2ba-d3f3e693efd6	Epherem sisay	ephrem@ienetworksolutions.com	\N	$2y$10$C5G1rJwo7XSEr1GLm7OZH.e2eKxREpptTWXXTIkCFvkDT2Gye0auq	\N		f	\N	2022-10-22 04:22:33	2022-10-22 07:32:10	\N
3061ef54-3d24-4cd7-9a93-1f631f811c67	Yekoyesew Eshete	yekoyesew@ienetworksolutions.com	\N	$2y$10$UOgCX24WvWRlA7v57akhwO/CqsJtle/2HL9fWW0F/W7WeNbFmugYe	\N	\N	f	\N	2023-07-12 19:17:13	2023-07-12 19:17:13	\N
3142aac7-3c3b-41f6-b32c-1a38c7c47a7c	Nathnael Hizkiyas	nathnael@ienetworks.co	\N	$2y$10$yQ7i7KPfqQ5MZxWdG6aENO4LnaYYu7FC9fYLH8XCJ8cuDlEq4G2um	\N		f	\N	2022-12-20 21:59:55	2023-01-31 13:31:51	\N
323ad41e-3a9a-41f6-84b8-d36f8cfac022	Zemenay Amare	zemenay.a@ienetworks.co	\N	$2y$10$AZbMp8Yj58ze19xpwyyS5OUnshMU9qopuEwZ/CgfaaMhdlfIFDRBS	\N		f	\N	2022-10-22 04:27:10	2022-10-22 07:32:36	\N
33465d05-1fd6-4d57-9690-8650773201b4	Daniel Degu	daniel.degu@ienetworksolutions.com	\N	$2y$10$nfseEtlNpsrqLZzzjAMf6uRYFQ4tb.wsye16UhmMVNH0y3ab4nhji	\N	\N	f	\N	2023-06-23 12:20:45	2023-08-02 14:12:06	\N
34757047-6135-4677-94d7-d1fa9da10db2	Eden Solomon	eden@ienetworks.co	\N	$2y$10$POhWLsLECPYnvsAspBl2J.6G7j8yLp3RfJpXK390vuhb20lr4gxWm	/ProfilePictures/1666423066-130-1300667_this-icon-for-gender-neutral-user-hd-png.png		f	\N	2022-10-22 04:17:46	2022-10-22 07:33:05	\N
35515389-dd95-4dfc-b4d1-89ac8537b386	Gediwon Weldeyohannes	gediwon@ienetworksolutions.com	\N	$2y$10$nC1kbuCZgEjouIWroLm14OvpZ7PWkTmbBDKwfoW2/d7pp82u7mYym	\N	\N	f	\N	2023-07-12 21:29:22	2023-07-12 21:29:22	\N
358a673d-2c91-474e-99e3-a96b234594e0	Dejenie Melessie	dejenie@ienetworks.co	\N	$2y$10$P.5OPpTcTJSxpCinfMOzDOYiD1gtKPQBU7NOFM0Ca8hxHZMUkL0eS	/ProfilePictures/1667311252-Dejenie DV photo.jpg	/signatures/1679295972-4f9aa1af-1621-4341-bf7f-0105f5d34f2b.jpg-output.png	f	\N	2022-10-22 04:25:00	2023-06-05 16:00:27	\N
393dc35b-361f-4330-9786-97cc20c4774b	Daniel Alemu	daniel.alemu@ienetworks.co	\N	$2y$10$uPC2s5mg75BWJIjJPTew5OUki5/UgsZyfWMG8Hf5iNQvcGfnEUVYy	\N		f	\N	2022-11-03 14:06:55	2023-05-09 20:05:37	\N
3a464d46-a7ae-4f38-8635-dc1bc18761f9	Kirubel Simachew	kirubel@ienetworksolutions.com	\N	$2y$10$T5UBq4z37qA3SEoTmi5GIOcyoyPdzICXAtD.V2kB9M3wXhCdjbRgW	\N	\N	f	\N	2023-08-02 02:16:34	2023-08-02 13:13:20	\N
3b9acfd0-6609-4ce8-a336-f4b9957cd269	Ermias Endalamaw	ermias.e@ienetworksolutions.com	\N	$2y$10$aiSVmI/d7VZELTsCcYhTo.yW9zzHdxEIup8rP./Dp0g6TybrXbeJq	/ProfilePictures/1666423571-130-1300667_this-icon-for-gender-neutral-user-hd-png.png	/signatures/1685027935-IMG_0163-removebg-preview.png	f	\N	2022-10-22 04:26:11	2023-05-25 22:18:55	\N
3bb205b8-afda-4492-970a-65321050b4b3	Getachew Babulo	getachew.b@ienetworksolutions.com	\N	$2y$10$ryCEDi3B6QrIUA7WGwqKJ.z38a4alk7djlWTgcGw4WOgYTcu3k17S	\N	\N	f	\N	2023-08-10 19:59:44	2023-08-10 19:59:44	\N
3e02ba82-eef4-4c88-8acc-b6cf8c09c956	Kiya Gebru	kiya@ienetworks.co	\N	$2y$10$EpJfwaW7asKCtQLgSMq3tuniwcuEU.qeaDvNpagqPfQxtsybTBgBK	\N		f	\N	2022-10-25 06:34:55	2023-07-06 13:13:13	\N
3ee572bc-ccc7-485e-81a0-3370bee6dd84	Imlak Menessa	imlak.menessa@ienetworksolutions.com	\N	$2y$10$V0repTX98tuv7pg/gov.JO2/4n2CjY5szrSpxVlN.aTVhOV59.Wu.	/ProfilePictures/1679494147-1185102_705283102831605_1511500436_n.jpg	\N	f	\N	2023-03-16 20:32:31	2023-03-22 21:09:07	\N
416c1cdd-4444-4b40-a8d6-d338154cf2d5	Tigist Gizachew	tigist.gizachew@ienetworksolutions.com	\N	$2y$10$5xgH8oKhiNZSi2rSmcNRHehK52tGEpmFRPifDYrqPUMP8TkqAyZMy	\N	\N	f	\N	2023-05-04 13:54:18	2023-05-04 13:54:18	\N
42688f5e-9e16-4d2e-8c7a-c9981c72c69a	Tsadkan Yohannes	tsadkan@ienetworksolutions.com	\N	$2y$10$I2puC6Bh4PKtZaXeDcnAnevcNFtP4aE8NfFAqvaX96M.kLuBz05xa	\N	\N	f	\N	2023-07-06 00:55:18	2023-07-06 00:55:18	\N
46018fe7-9058-4f93-a556-60f06fb6a3a0	Hannah Girma	hanna@ienetworksolutions.com	\N	$2y$10$2hSjAUbsNzCbzWLk9pEneOtzFDoApUbfglcZzlsIVqjkFM0QQJEPi	\N		f	\N	2022-11-02 20:22:49	2022-11-02 20:27:16	\N
47b897c8-c735-4e42-a84c-89ec4ed818bd	Dagmawi Yohannes	dagmawi@ienetworks.co	\N	$2y$10$8OY5W9.0RF7S9oGg5FGPneC8itaZYXzambdhp7A00lSgMe3kKWg2K	\N		f	\N	2022-11-11 17:38:16	2022-11-11 17:38:16	\N
4a29e7a9-303f-47ad-91fb-1b5eda5d110b	Yayehyrad Ayalew	yayehyrad@ienetworksolutions.com	\N	$2y$10$OB962ZvMkG4EX.kYZkynRe0iPSTUnRoF8B/fLWzqq28QY3arP2Ava	\N	\N	f	\N	2023-07-17 21:09:56	2023-07-17 21:09:56	\N
4a6dd0e8-d354-431b-bed3-933b32828719	Henok Petros	henok@ienetworks.co	\N	$2y$10$jzMMbTj./mDsFYpQ1wur2O02z3wOHVfBsLlLXggiAb21XIwtx2Pmu	\N		f	\N	2022-11-03 20:35:02	2022-11-07 12:17:53	\N
4bd73d59-b981-45b9-a152-638c43f3c43d	Fikirte Mekonnen	fikirte@ienetworksolutions.com	\N	$2y$10$KTQfjPr34BXcuwEumCtnyOmtZQMNrM1XFUPPGcdDtDNEyySM4OgAa	/ProfilePictures/1666423280-130-1300667_this-icon-for-gender-neutral-user-hd-png.png	/signatures/1688544334-20230705_105429-removebg-preview (2).png	f	\N	2022-10-22 04:21:20	2023-07-05 15:05:34	\N
4cf2c1dc-683b-4f3a-af20-2ef21b9a171a	Debora Melaku	debora.melaku@ienetworksolutions.com	\N	$2y$10$LSfC0V5kM9gC.vWu7RH0y.KgBzpyrIiImIKv0HCq82uguYB5iWMge	\N	/signatures/1687531509-20230623_140408-removebg-preview.png	f	\N	2023-05-24 12:54:45	2023-06-23 21:45:09	\N
52f82e62-5ff4-4c49-986b-98e2adfd4bd1	Tina Kibru	tina.kibru@ienetworksolutions.com	\N	$2y$10$Z1IhA.Wh.8KG97Qp1.tPCOY4gC86L4JcNYUzApaTmwqMggGuSYKi2	\N		f	\N	2023-01-09 19:46:06	2023-01-09 19:46:06	\N
53aaad58-6267-4c76-9c39-c51b082f8804	Tasisa Yehulashet	tasisa@ienetworks.co	\N	$2y$10$NFaPGyK0S6l41rZNozmsaOtZDpzYjX2v99/9jH/k6pF63y1l1uqVO	\N		f	\N	2023-01-06 11:49:38	2023-01-23 19:55:20	\N
53d612ee-4ff3-467c-bf6a-6aff9311ad1c	Bisrat Negash	bisrat.negash@ienetworksolutions.com	\N	$2y$10$puW5JWueZhwreN6ss/uDiu1A1XgG7qRk9tsteSqCPiWEA9nu/AvLe	\N		f	\N	2022-12-21 12:24:06	2023-04-25 03:12:16	\N
566d1d96-b241-402e-a93f-c9f0d7bcdc5e	Mikiyas Girma	mikiyas@ienetworks.co	\N	$2y$10$Wwt6frusCwBUc3OIypCHXO734z8bDyqRQ4ZMSiqbJJeABKm46yWf6	\N		f	\N	2022-10-22 04:18:59	2023-05-12 02:31:07	\N
59258c1d-9735-40cb-94b9-02d0f4bd25ce	Abraham Dulla	Abraham@ienetworks.co	\N	$2y$10$Q5w/DHmuvaku6itxxEraQO6gqwCENFG3jFs1RQh97kGnwzAB8bQXe	/ProfilePictures/1667974376-avatar-130-x2.avif		f	\N	2022-11-09 12:15:00	2023-06-12 13:19:43	\N
5acfe2b4-4dc2-46a4-b6c0-3294e2a3f9a8	Haymanot Tsegaye	haymanot@ienetworksolutions.com	\N	$2y$10$Mn3xgAUlDMV56U95Tb5jp.ugZSj8AZUNr0Z7h/IsxjrlSVzSGYwiO	\N		f	\N	2022-11-11 13:44:39	2022-11-11 13:44:39	\N
5c7260b3-a3dd-4272-a90a-ea20bec9ca67	Mebrate Degu	mebrate.degu@ienetworksolutions.com	\N	$2y$10$Aw0bqcMwmbgHJGXzzbCSBe1gnlSyedVuPLSvOyZNY/R39CGzrUxo6	\N	\N	f	\N	2023-05-03 21:27:36	2023-05-03 21:27:36	\N
5d96355d-16a6-43bb-a4fa-4dcb2e219be4	Selam Haileluil	selam.haileluil@ienetworksolutions.com	\N	$2y$10$VoLUhzgWK.MxX15YxUasJ.3Rwh9vqrvO5PUxT3xRR54QnGoOzU0k.	\N		f	\N	2023-02-09 11:34:29	2023-02-22 14:43:49	\N
5eb660d6-2204-4980-ab79-028538453b2f	Ephrem Sisay	ephrem.sisay@ienetworksolutions.com	\N	$2y$10$pFKvQjPPh.9IjTiahMkCZ.vSlENWYCtFehnpJ8vKwPNqPq3PisDqO	\N	\N	f	\N	2023-04-25 15:45:46	2023-04-25 15:45:46	\N
5fa52139-152d-43b8-ad2c-df086092265c	Tigist Yiblet	tigist@ienetworksolutions.com	\N	$2y$10$.S4Di9h.2.nBLyf8g/tAXOmZRhcaVnEP7woDFidGB2122nMuIdv1O	\N	\N	f	\N	2023-05-08 16:49:45	2023-05-08 16:49:45	\N
61894d14-192d-4d8e-b795-f893fd39ba98	Hana Dereje	hana.d@ienetworksolutions.com	\N	$2y$10$7uXlQEZ.xFQN59lleAOIneqqsp6ldDv6TkCByAUPuTMnJErtcYZIa	\N	\N	f	\N	2023-04-27 20:42:08	2023-04-27 20:42:08	\N
61f56d36-23b4-4720-8985-9ba22fd2b69d	Fasika Tesfaye	fasika.tesfaye@ienetworksolutions.com	\N	$2y$10$MYaVR5/AkBYXWGwbGRDVIucV8mX/QbCVsgGEcIgJaFYcyN0UF326G	/ProfilePictures/1666423094-130-1300667_this-icon-for-gender-neutral-user-hd-png.png		f	\N	2022-10-22 04:18:14	2022-10-22 07:36:09	\N
645b33f9-f290-4143-83bf-ce0cce4ecf91	Nahom Debele	nahom.debele@ienetworksolutions.com	\N	$2y$10$1Y84rbsZM2SDUXiT2NZBb.HqXOemOOXoeOJOIGRTp8XaRaboCdb7u	\N		f	\N	2023-02-02 01:01:32	2023-02-02 01:01:32	\N
6471a4b5-d90c-45d3-95e2-c0314996f7d6	Amanuel Girma	amanuel@ienetworks.co	\N	$2y$10$2nda09pX5/9/AE3p/ID2wOZe4MPRDI3E/lMwkfpHm4uMb3WVRLa8K	\N		f	\N	2022-12-28 15:36:42	2023-05-11 22:09:28	\N
670090de-5622-4aac-a6bb-906cc47b1d0c	Mekdes Mamaru	mekdes.m@ienetworksolutions.com	\N	$2y$10$IidL6jwDdxL40n9Yt2M.F.1ZCOVyobxdvpzbtxENTD.s8royrrHMe	\N	\N	f	\N	2023-07-31 15:36:17	2023-08-08 22:25:50	\N
692d6491-191d-4582-aa95-918c621d20f5	Yohannes Gebredhin	Yohannes@ienetworks.co	\N	$2y$10$eP5cVWKwSgdHcWtJGodiwu9F3hTGaoPMY9MLoJs9sCS3lYoOfq.nC	/ProfilePictures/1666423240-130-1300667_this-icon-for-gender-neutral-user-hd-png.png		f	\N	2022-10-22 04:20:40	2023-07-04 20:22:46	\N
6d2e50d0-7093-4f2d-9d96-8293f8832556	Betelhem Abebe	betelhem.abebe@ienetworksolutions.com	\N	$2y$10$ahOcRneE8iSx8DeE1TV.a.fKQKuOPI1kwPRHSxBCPr23v0qFaPFa.	\N	\N	f	\N	2023-05-09 20:23:11	2023-05-26 22:00:55	\N
6eeecb88-cd64-4e36-807f-f654af2fe20e	Binyam Sirak	binyam@ienetworks.co	\N	$2y$10$eom3Yb27q.MzC0IY4z4j1.XPZIVco99Do3QRqXchmK37bDNfgz1Iu	\N		f	\N	2022-11-07 20:48:37	2023-01-05 23:51:29	\N
6ef3db7a-e617-4198-aa3e-6d2910f889f8	Heldana Getachew	heldana@ienetworksolutions.com	\N	$2y$10$hGFYvv0POtgh0KD.CmhnreG84uBXf2K31g38jqgvnuOVYw4DhaRli	\N		f	\N	2023-01-05 01:24:49	2023-01-05 01:24:49	\N
73446696-060f-4447-a070-3d02e2783111	Solomon Teshome	solomon.teshome@ienetworksolutions.com	\N	$2y$10$1RtYzEmwaleskg3xYaZUGuy6XowUfs7WxRFdv1u6lMsfmc4s2JhaG	\N	\N	f	\N	2023-05-31 12:54:46	2023-05-31 12:54:46	\N
7363c810-b7c0-4bc7-b42e-6d3db63c38f6	Selamawit Getaneh	selamawit.getaneh@ienetworks.co	\N	$2y$10$aEnQAOksEtdxwcecFp6HEeBbrWjGEMVzhgqQ3dSRnXax9Tb3OqD/G	/ProfilePictures/1683570098-black.png		f	\N	2023-01-12 14:02:28	2023-05-24 19:27:24	\N
738b7525-161f-4833-8746-2433e9beb4f7	Natnael Anteneh	natnael.anteneh@ienetworksolutions.com	\N	$2y$10$n5SMpRqNv8LLRm/5kgMmoOdE6gDtzlXNqGek6X.BYkUk4ZULwAJy.	\N		f	\N	2023-01-06 11:03:47	2023-02-02 12:10:28	\N
73dccf3d-8138-4e54-9d2f-fb8a930c9e6b	Addisu Denboba	adisu.d@ienetworks.co	\N	$2y$10$MzxsT6o.64WO8.rZJfZPPeJfMKKxr6WY77BBcuwNo8b955V8BkAsO	\N	/signatures/1687531184-832cd64b-c0b0-487d-ba3a-536b803b7249.jpg-output-removebg-preview.png	f	\N	2022-10-27 06:15:41	2023-08-10 13:37:49	\N
75186c0d-08ac-4442-8cab-9dd84bef8455	Dawit Yeshitila	dawit.yeshitila@ienetworksolutions.com	\N	$2y$10$GOGI4k75yQI5yR6LAKUyyOYHOGNIYxw/AYATt7uUzNzPTRUYicbda	\N	\N	f	\N	2023-06-21 18:05:01	2023-07-07 19:00:27	\N
751f0fe5-05e7-4c4e-92f7-43d592e9161b	Tamiru Belachew	tamiru.belachew@ienetworksolutions.com	\N	$2y$10$RV.teXVWCmK8tGZkkd5f3.8/W8HrQgNPrgydhjOTqZyX/EUGv8wmq	\N	\N	f	\N	2023-05-10 14:23:03	2023-05-10 14:23:03	\N
78792873-88f2-4a92-9696-3be4271702b1	Meseret Kassaye	meseret.kassaye@ienetworksolutions.com	\N	$2y$10$qNcdALLxMv28wNjSm37qe.3b8UPIYZ0v7Hgh3JfedQWnhkxl9Gnle	\N		f	\N	2023-03-09 11:51:09	2023-03-09 12:11:18	\N
7888ef3a-eaef-4174-9843-abd202f68161	Mekdes Haile	mekdes.haile@ienetworksolutions.com	\N	$2y$10$c3hAgSUtrbcWLYx3PePb0uuoj3aLEnHPHtuL/2/IC2RQNZPv0uaBG	\N	\N	f	\N	2023-07-12 00:53:17	2023-07-12 00:53:17	\N
78b21094-f497-4b6c-bc4a-752682edef93	Sinit Mehari	sinit.mehari@ienetworksolutions.com	\N	$2y$10$axMD6X1h9D7UJLiZknQMMO5PKie9jtjBnTs/zr2gp54NIGRvoTu12	\N		f	\N	2023-01-26 18:14:08	2023-01-26 18:14:08	\N
7a10fe3d-71dc-4901-9203-d0bc4e45ea56	Yidnekachew Assfaw	yidnekachew.a@ienetworksolutions.com	\N	$2y$10$zpOxbsO5cSu8RJ5lMQZV9OGvXf4wYBvhIj455munKd6bdLYXUm1wC	\N	\N	f	\N	2023-06-08 10:48:54	2023-06-08 10:48:54	\N
7b1dda68-c4f4-403d-bf85-aaad6bbf8bd5	Sualih Mohammed	sualih.mohammed@ienetworksolutions.com	\N	$2y$10$oGJvYuoFow3mlOBASWyya.jAh/z3BnWeO4BH6Z2YZMIIJqd80Dyae	\N	\N	f	\N	2023-05-24 20:34:13	2023-05-24 20:34:13	\N
7e971a32-9791-4e73-ba7b-4e4ffe7a670b	Zekariyas Fikadu	zekariyas@ienetworks.co	\N	$2y$10$wOhwMUus7I26bhm4cwaQ5unmjp.EEe6ijswSeTSCh4jGXblkGvFnu	\N	/signatures/1687272773-zekey.jpg	f	\N	2022-10-23 05:38:21	2023-06-20 21:52:53	\N
83c71fea-d35f-4e14-a017-6ad6851d2802	Yibeltal Yismaw	yibeltal.Yismaw@ienetworksolutions.com	\N	$2y$10$Ck1XdKIxTMk0g6l8lCO/FumSW9T9yPaOFRImCPwEQSxqcon1EHoU.	\N	\N	f	\N	2023-08-04 15:23:43	2023-08-04 15:23:43	\N
84fd4408-a4c2-4c69-8713-36dbb72a519a	Beamlak Zerihun	beamlak.z@ienetworks.co	\N	$2y$10$LgTHze0z72qymMD/HtG73uhO/OuD.MqUCz0EkSdoV7RbI7fBX5krC	\N		f	\N	2022-10-25 05:10:30	2022-10-25 05:26:06	\N
86951d22-4071-4d82-8129-ee7a5f301cf2	Fikirte Kibru	fikirte.k@ienetworks.co	\N	$2y$10$glaAtB4hImWmm6j5mp1yWe2INanzsv9Pjo26w8wIuW08FZtQi3QUm	\N		f	\N	2022-11-05 16:08:03	2023-01-16 20:30:55	\N
8696b407-7a8f-4932-82bc-802d98506ac7	Haleluya Tasew	Haleluya@ienetworks.co	\N	$2y$10$ixtZQJDKtBlB.3k4Fv4SYOZyg16RL0dTUiT3.XnVFnc9BvkJbKdvG	\N	/signatures/1686302182-Sign.jpg	f	\N	2022-12-30 19:05:38	2023-08-09 18:33:24	\N
886deac5-d577-4184-a463-6b616816ec1f	Mahlet Kindie	mahlet.k@ienetworks.co	\N	$2y$10$hXnotqU6UR3Mx.PuIlz1bO8DEglk4yOEYEqUsZOI4YND9GKDk1xza	\N	\N	f	\N	2023-03-30 15:51:00	2023-06-01 14:42:42	\N
8a3cd45a-893d-4da6-8825-4962e7b8d158	Biruk Habtamu	biruk.h@ienetworksolutions.com	\N	$2y$10$zwVX5oq4q/.V1qz4N8BsgO7f6jpTOzy/InmP2axA6I0IOLtYDXAwC	\N	\N	f	\N	2023-07-03 14:54:24	2023-07-03 14:54:24	\N
8bd84503-dcf9-4638-abc2-7cefc330e488	Hermela Mulugeta	hermela.mulugeta@ienetworks.co	\N	$2y$10$iqqYN43QJbAuncfPpK6meuN9UN.uswnGWRZ7bwa3jHdvrArnYRJs.	\N		f	\N	2022-11-02 20:12:47	2022-11-02 20:12:47	\N
8dfded72-b2df-4a73-a15f-96224b2eb296	Rahel Degefa	rahel@ienetworks.co	\N	$2y$10$OCGRGVcwFyH5rGS0vR5uaepUSEvt61BiXkEaI9Ukaib9R9ocURUOG	\N		f	\N	2022-11-07 16:30:20	2022-11-07 16:30:20	\N
8eae926d-ca4c-4ffe-aa05-dd2ff093eb8c	Semira Hussien	semira@ienetworksolutions.com	\N	$2y$10$1VKcDA8GdOVTgtb3FvoXneASYvjKcLmJnQ1vEMEiNdiIKAvKiECb.	\N		f	\N	2022-10-26 06:06:43	2022-10-26 06:08:43	\N
8f63480a-84a9-41df-994e-d67f8d7bc0a9	Beckham Berhanu	beckham.berhanu@ienetworksolutions.com	\N	$2y$10$c2NArSGI0WzohG/D2EYequ39PIVUylGKbtGKTjmt3obMEEn0nZ70e	/ProfilePictures/1678707705-bbm.jpg	/signatures/1679304797-IMG_20230313_143854_627.jpg	f	\N	2023-03-01 22:06:28	2023-03-20 16:33:17	\N
8ffbfbcf-b672-4de8-ac21-5d775053bb9d	Natnael Gebremeskel	natnael.g@ienetworks.co	\N	$2y$10$sSp1Qg9QDu34m8P6BtNxtOJoADsfgTlZL48HRH4bFMWKD0rziGmMW	\N	\N	f	\N	2023-05-24 15:27:35	2023-05-24 15:27:35	\N
91f26dbb-2b74-4827-a722-13da4fb7e863	Zerabruk  Assefa	zerabruk.assefa@ienetworks.co	\N	$2y$10$TM/OGqa4Ei/.J/8Y08Z2FOn4S8Mr2As3v5pXycsaVKByO7N5IIoiu	\N	\N	f	\N	2023-06-06 15:39:12	2023-06-06 15:39:12	\N
92b3439d-2895-4dcd-b4d1-16e981e5e1f5	Addisu Degefu	Addisu@ienetworks.co	\N	$2y$10$Jg6dFd6k6AIov7uQIaG.auHULkBJHNzlfDqRiljd4K4ex0yAZ3rYa	/ProfilePictures/1671170031-20220601_1708553296252021406834023~3.jpg	/signatures/1678307579-Jangminho_signature.png	f	\N	2022-10-25 05:43:19	2023-01-28 16:49:51	\N
92d32c9a-d491-48a1-8702-4a75cb208e53	Yonathan Daniel	yonathan.daniel@ienetworksolutions.com	\N	$2y$10$FTy1uY3qsOe6OqOA31ebHuTsK/8.hwqlDRG/FTGEOOCQEdqRn62YC	\N	/signatures/1686316453-Screenshot_20230609-161314_WPS Office.jpg	f	\N	2023-03-09 21:21:40	2023-06-09 20:14:13	\N
93afd5c2-f97e-41fe-83ba-62320a2adfac	Letera Tadele	letera@ienetworksolutions.com	\N	$2y$10$Uu/ceE7JaSLwWmI5B2WoLuJkDqa5JtUizoZFttzwtdj//rA/gYbKG	\N		f	\N	2022-11-05 20:20:32	2023-05-09 16:22:09	\N
964e5030-0760-4297-b62c-abbb352078b8	Sintayehu Ayele	sintayehu@ienetworksolutions.com	\N	$2y$10$L0x6y3iMYt.E7.nNAdn57eOawCmCFBgaPM7N2LshggoQCa4f5Z7qG	\N		f	\N	2022-12-15 11:57:16	2023-01-27 16:20:22	\N
96961357-969d-42c2-bcc9-7ba2747707ba	Misgana Desta	misgana.desta@ienetworksolutions.com	\N	$2y$10$c7hJsFJbtEDhWfFM7ppLNO6toAfrcowF7O7WWo4E5hK//20XbIEfa	\N		f	\N	2023-02-02 13:30:32	2023-02-02 14:34:18	\N
9d2507b6-0823-4aa3-837c-10ab4061bb6b	Bezawit Tekle	bezawit.t@ienetworksolutions.com	\N	$2y$10$yu6BD17OxJpavCxgZH1keOy.ZS2k7vg9..XaZRbBhXYDCcJks03de	\N	\N	f	\N	2023-05-30 19:45:04	2023-06-13 20:06:51	\N
9e9d2642-5a21-48a0-aca6-2dfa6abcfb18	Samson Dejene	samson@ienetworks.co	\N	$2y$10$CVPYslYzXbFAjM4wT9JD8.PD7FKToKt83dzTNa1L0uJMzOF7YECyu	\N	\N	f	\N	2023-04-18 16:18:04	2023-04-18 16:18:04	\N
a0c16b38-4940-436e-9b17-e7b4bd6fd455	Mohammed Seid	mohammed.seid@ienetworksolutions.com	\N	$2y$10$eHL.5/NaB96EKqOf3nW5h.yfgw3/pR21p.Z.ly621YLu1wVcdksv6	\N	\N	f	\N	2023-05-04 14:38:55	2023-05-04 14:42:01	\N
a0d41bce-a8bd-4e1b-82a9-1915b3690349	Lidya Eshetu	lidya@ienetworks.co	\N	$2y$10$vOMHE912okCigXBtG./6ceZjhCKUESBI76SAgegh/mNpG7crzHzkq	\N	\N	f	\N	2023-05-04 11:41:06	2023-05-04 11:41:06	\N
a599dc30-6e74-4874-9413-34ce6b235944	Yonatan Mesfin	yonatan.m@ienetworks.co	\N	$2y$10$dJAkzkxEjVjBz4rB7VkSeuUBwMuYAXgw1f/ZEhW2.VNeQW9tvADku	\N		f	\N	2022-10-22 04:17:20	2023-05-26 16:24:24	\N
a5ce217a-9f1b-41de-a508-63bcfaf6a2e2	Eyerusalem Tamrat	eyerusalem.tamrat@ienetworksolutions.com	\N	$2y$10$eu6.JLgYdUDqj.bXgWKXEuzsWaN1opf8zbX9xPVuA59qyhCsZhKmm	\N		f	\N	2022-12-21 16:30:02	2022-12-21 16:30:02	\N
a65b7b26-0623-4623-bdd5-9690ebb25895	Tewodros Tilahun	tewodros.tilahun@ienetworksolutions.com	\N	$2y$10$j768wLJlOLs.svajWbmxVOyzpNE96hy.qKNlYVo8RKYMEfLhTsH9G	\N		f	\N	2022-12-29 22:53:58	2022-12-29 22:53:58	\N
a736133c-8c19-4b16-a552-1f9d00a0de50	Zeneb Kassew	zeneb@ienetworks.co	\N	$2y$10$htCOtIyFXzbHABHjJiblnOyvkTfoGnonTA5URlRBEpc1OSJEkQNom	\N		f	\N	2022-12-21 14:25:12	2022-12-21 15:31:56	\N
a79b8aaf-f5a5-4081-8b7b-7856ffa694ec	Samuel Simon	samuel.simon@ienetworksolutions.com	\N	$2y$10$ZMwQOTSSWOitndIdEI6ZfOd2oP0RgzVJPg.nMQxLpjmdFfYIV93/S	\N		f	\N	2023-01-26 19:02:49	2023-01-26 19:02:49	\N
a7a2daff-db3f-42c8-9b80-857053f0e8ba	Kalkidan Fasika	kalkidan.fasika@ienetworksolutions.com	\N	$2y$10$BoZW/YQCGJcnKVrcgb6lOubGGFD5Rl.DrM0WIaA6srBETXHKXIMe.	\N		f	\N	2023-01-04 12:46:54	2023-03-13 19:58:49	\N
a8bf1197-4db9-4241-8e2a-fe42a08794e1	Natnael Tayu	natnael@ienetworks.co	\N	$2y$10$jt8WIA5G70hvzn9m3qdEtunY9hIjvN1bqxCt25BCeuloznrUiylbC	\N		f	\N	2022-11-07 16:48:52	2023-05-23 13:26:19	\N
ac8738c7-b6ad-43ce-8ca6-9162fd312e81	Fana Girmay	fana@ienetworksolutions.com	\N	$2y$10$o6/ZxdOGTqXiDs/N/R4ND.PWfo0Klol3hvQbzrXwSqsA60DgcFbzW	\N		f	\N	2022-11-04 21:29:33	2022-11-05 19:46:21	\N
ae3ba6d7-6e8e-407b-a6bf-c6e5c6c0c585	Tamirat Tinko	tamirat.t@ienetworks.co	\N	$2y$10$JwmzKbf3u00IHHYBHOpa1egCLJLH5t9X6zL/ufc0oN.A5RB7VFLQu	\N		f	\N	2022-11-11 18:53:39	2022-11-11 18:53:39	\N
b1653db2-6ac6-42bc-b16b-b6e398c1d6c7	Abdelah Yisehak	abdelah@ienetworks.co	\N	$2y$10$0rE6.bo3vs99JvimiFTcu.LDoxfkqgp1g4EHVTXKMuCtgqGNrIWUK	\N	\N	f	\N	2023-08-04 20:18:37	2023-08-04 20:18:37	\N
b16f69d6-401a-43c6-bfc7-7d496acae586	Betelhem Mewcha	betelhem.m@ienetworksolutions.com	\N	$2y$10$Zd9wKgWpllE/yiLOL2s4qu6F5QIeQJRVrbl.h5JRxD8DUEiiTwcZu	\N	\N	f	\N	2023-08-02 13:23:58	2023-08-02 13:23:58	\N
b1c8bc73-c863-4b7c-9c5d-bceda07e3702	Getachew Babulo	getachew.b@ienetworks.co	\N	$2y$10$U/Mi/HBX3Z0YW3wtN62L4uGj.QbKzmp70susXPTUo67zbtKNDcfs.	\N		f	\N	2022-11-02 20:13:18	2022-11-02 20:13:18	\N
b23300f0-8bc5-405c-805c-5ed5035f46cb	Teferi Kassa	teferi@ienetworks.co	\N	$2y$10$xZ1OPOrGSxW/Crpn9dwb5OpgFYkq2CoQHgdJoGGVczQ.Xmo.rL3Tq	\N	/signatures/1687526038-20230623_160734.jpg	f	\N	2022-12-20 21:11:53	2023-06-23 20:13:58	\N
b473dd62-d666-42ac-8c47-02d222db4c00	Asrat Amare	asrat@ienetworks.co	\N	$2y$10$8lSnA1hE7clsPad2TfQjqu3Pno7VnOfU4pK70DpTJ7MOkDTBdWqHW	\N		f	\N	2022-10-27 08:08:53	2022-10-27 08:09:26	\N
b6b30562-93e8-43d8-a87a-29150fbd17cd	Dagmawit Melaku	dagmawit.m@ienetworksolutions.com	\N	$2y$10$Fz8jkK5O77jJgB86/QS0Y.pTpL40iLbBMIIfeohzAHMpO.z.qzzai	\N	\N	f	\N	2023-06-01 12:10:20	2023-06-01 12:26:16	\N
b7efd943-f1e8-4a29-9882-69b8231c07c0	Senait Wouibshet	senayit.wubshet@ienetworksolutions.com	\N	$2y$10$koDN4Z8fA/be4Kn9VyoLneGg4BsrC6MeIkZSSmM2f1qdjtrzRZdNy	/ProfilePictures/1666961634-avatar-64-x1.avif		f	\N	2022-10-28 09:53:54	2022-11-07 12:23:16	\N
b88d0a5b-9c1e-4224-8f39-3bc212b064cd	Tegete Meketa	tegete.meketa@ienetworksolutions.com	\N	$2y$10$PSgURuj2YxpPlj2lD4mZ5e9C1BAcWcb2BK1BWYbEIDfYOilbiIXXS	\N		f	\N	2023-01-20 22:08:48	2023-01-20 22:08:48	\N
b984511a-08f7-4757-af80-ac9e09ebd06d	Biniyam Tekle	biniyam@ienetworksolutions.com	\N	$2y$10$DtaKN3TQTBihMDnbqVcIVeKy1WV9pt9rkdaXOY4rgBXlPQ8.B7Lje	\N		f	\N	2023-01-05 20:07:44	2023-02-08 18:26:15	\N
bbca55de-6aa4-478b-a543-5cc3db99d76c	Asegedech Bekele	asegedech@ienetworksolutions.com	\N	$2y$10$y1SolcjYw2UhiG0hqpGzb.8I7LFGr/ks2BHr1.CuOvh7Bdk4pAqgm	\N		f	\N	2022-12-09 21:27:00	2023-01-11 13:01:22	\N
be3faeac-bd8b-498a-9312-ce3de18b784a	Zemen Teshager	zemen@ienetworks.co	\N	$2y$10$czNwQWeGwd3OqP5gvKd/dOXMLsDXegBiF1U2tBKLPixCNGSYi/zvq	/ProfilePictures/1666680089-photo_6044096176610982438_y.jpg		f	\N	2022-10-22 04:15:08	2022-10-25 03:41:29	\N
beb862e4-f6fd-4798-ae36-9fe25bce99d8	Mastewal Betigist	mastewal.betigist@ienetworksolutions.com	\N	$2y$10$DNsnVOOb07Bppp96P/0Fu.WmycL3Isz9a9hr5sEU3Qr3sj9tezHNe	\N		f	\N	2022-11-07 12:13:06	2023-01-11 20:19:20	\N
bf2ae710-324e-4b3c-ac1b-191c406d733a	Simret Andualem	Simret@ienetworks.co	\N	$2y$10$EgSq16uiOFc/Uu9Qh5G5KeOhZjijbaMM4vFF00nPFigTF.3y859Ki	\N		f	\N	2023-01-11 19:25:43	2023-02-21 13:00:20	\N
c006ea63-b59d-438c-9f8d-7c5878bec49f	Tilahun Tegyebelu	tilahun@ienetworks.co	\N	$2y$10$WBJNJu6EdE2F7X5nTkC8ae3V.vbCIMY3iAKwDch1A79sg.51LUrQm	\N		f	\N	2022-12-10 17:21:07	2022-12-10 17:21:07	\N
c721de15-78ba-47fb-8d8b-43075a6d666c	Seada Shemsu	sead.s@ienetworksolutions.com	\N	$2y$10$2G4S/w2vKX1CHIrERmiWSe.sEnfjJ5cbLpg.nkquks.j.2aNbqiEe	\N	\N	f	\N	2023-07-04 14:06:53	2023-07-17 18:51:21	\N
c77e53fb-7b99-465f-9cc6-63d860360a49	Meried Bekele	meried@ienetworks.co	\N	$2y$10$Tgb2AJSStVbwvfT1IfIa0epzX/LBs/nu21XojLodRcQ7CBqyw/Lxm	\N	/signatures/1685086228-Meried signature.png	f	\N	2022-10-22 04:14:32	2023-05-26 14:30:28	\N
c94439bf-daf8-446e-88cd-4f9ac762b373	Elisabeth Demisew	elisabeth.demisew@ienetworksolutions.com	\N	$2y$10$2fGsykOK1aSW//JUKPxEEuY4333GMB0Zmsq1ahnDX2c4e7mcyazU2	\N	/signatures/1685629640-CamScanner 06-01-2023 17.23 (1).jpg	f	\N	2023-01-03 12:43:14	2023-06-01 21:27:20	\N
c98f9222-ab37-4399-b4a2-486d557898fe	Samuel Belayneh	samuel.belayneh@ienetworksolutions.com	\N	$2y$10$G9/gXNXVMz.J5Wb9RxpXEORY5nnIBo537bCTi5YlDrPNnwoJwU6TS	\N		f	\N	2022-11-07 14:04:32	2022-11-07 14:04:32	\N
ca4391d3-0cab-4b13-acfd-4db35f94dcfa	Elshaday Yalew	elshaday.yalew@ienetworksolutions.com	\N	$2y$10$CJND0AzQTiFy0jUqIS8DX.TjWkdDOHB.leayJWadeSJ84WJF5obf2	\N		f	\N	2022-11-07 12:32:47	2022-11-07 12:34:19	\N
caddeb27-fb94-4e04-a079-3089345c7b1c	Robel  Getachew	robel.g@ienetworks.co	\N	$2y$10$quxI12pxNu1wzLEAU8.YA.gkDHAEAz0RTo.vw4PW5Jl0rT9keGXfK	/ProfilePictures/1672639710-A7DDA581-2987-4EBE-9967-4BEA4008C46B.jpeg		f	\N	2022-12-13 11:59:37	2023-01-02 13:08:30	\N
cb1c6447-4db5-48b8-b231-9a66e7132bf0	Dawit Eshete	dawit.e@ienetworks.co	\N	$2y$10$Uz3y3aIXhuRGysj/p80Oy.nswlA2u9xnunRkzeEn3H0.sF0UC/qJy	\N		f	\N	2022-12-23 22:16:28	2022-12-23 22:16:28	\N
cb4ffa1a-d67e-4fed-9554-e67ab486f78f	Meried Bekele	meried@ienetworksolutions.com	\N	$2y$10$BukOCWjRYdpYPKBjenuS5Os4y4eN8MAUquDlu7Z676vMitUt0TMB2	\N	/signatures/1685086306-Meried signature.png	f	\N	2022-11-04 13:17:33	2023-05-26 14:31:46	\N
cbbaa2e8-d8bb-42bc-a0dd-8eb0bf69ca73	Temesgen Fentabil	temesgen.fentabil@ienetworksolutions.com	\N	$2y$10$/YbnHfBezrcz5xSpaoZ8NuoIlPjOsjAXNDCgErQb9Axjx64wUlNyG	\N	\N	f	\N	2023-05-23 12:49:56	2023-05-23 12:49:56	\N
ce889e57-f63f-41bb-9262-e8eecc7a3996	Hana Wubtaye	hana.w@ienetworksolutions.com	\N	$2y$10$zrFvq7vOD095tI6TTvkwSujqguAHQD1QX8/xUZgs1/V48z1cCmPiO	\N	\N	f	\N	2023-08-04 18:50:07	2023-08-04 18:50:07	\N
cf3858b9-eed8-4f07-b261-6dde320d390b	Samuel Gesese	samuel@ienetworksolutions.com	\N	$2y$10$BjX2a3gFF4LN4Mj6woyc8OmmDjM6.WkLNpEw12T2qELf3xTt0Nk.q	/ProfilePictures/1666433633-130-1300667_this-icon-for-gender-neutral-user-hd-png.png		f	\N	2022-10-22 07:13:53	2022-10-22 07:40:37	\N
d20cc845-2cf9-46fb-90c3-d6180776c45e	Shugri Abdullahi	shugri.abdullahi@ienetworksolutions.com	\N	$2y$10$gEEs2vY8BE1WNveIFELh3eSnqAhhM7CAx6dZUTA/mXPyW8IqUtesC	\N		f	\N	2023-02-08 13:41:21	2023-02-08 13:41:21	\N
d559e77b-1289-4730-9498-aa55a15f2955	Brhin  Tsehaye	brhin@ienetworks.co	\N	$2y$10$g0HrH0XR3dFilHXLbb9WjeaqJvfLjArjgwR5kDudKyAMVsEPOwipS	\N	\N	f	\N	2023-05-03 12:15:23	2023-05-03 12:15:23	\N
d5ea58d3-b884-4ffe-926f-4e86a9f62d13	Natnael Zigyalew	natnael.z@ienetworks.co	\N	$2y$10$hAWdGnfiGvdgPHf2ybuIZeMC.hHNI.6fIIGsDhzgRb5xmTwbgTu0q	\N	/signatures/1685634612-20230601_184749.jpg	f	\N	2022-11-09 23:24:48	2023-06-01 22:50:12	\N
d72803b5-75b4-4682-ab1a-7ac22209d5b8	Tinsae Taye	tinsae.taye@ienetworksolutions.com	\N	$2y$10$Jnbr78RsoKBOYdz0tZboC.zCj74995kUpyMWJIeZlPdP0m3GT9lxO	\N	/signatures/1678779399-5972E803-B091-43C5-8DD5-31438DFD925A.jpeg	f	\N	2023-01-05 15:26:08	2023-05-25 13:08:37	\N
daea4735-35ea-4882-b2e3-654cd6255d7a	Hawi Hunde	hawi.hunde@ienetworks.co	\N	$2y$10$OX5HePh3yjPvyaDKhd3dvOAJhxtnKhcc3jGS4HiBdmGTeElAZ8kEi	\N	\N	f	\N	2023-05-25 17:46:47	2023-05-25 20:36:50	\N
deb4687d-9605-40a2-a342-a5ac4b7fbd89	Eyoel Haile	eyoel.haile@ienetworksolutions.com	\N	$2y$10$I1BZithS5gyI1YDX.tIyvOxkNzVoDMSUX/E9g8AJ5VLajMuY1Vp6O	/ProfilePictures/1679405155-prof.jpg	\N	f	\N	2023-03-09 18:53:33	2023-03-21 20:25:55	\N
dfc6b4b5-a7ba-42b0-88ed-f4e94bfb3bc8	Mathias Abdissa	mathias.abdissa@ienetworksolutions.com	\N	$2y$10$V2j5QUND3/4lqNGJ776TGu6m.c4KoKdYWtw5VKVPNynN1QyiVV20q	\N	\N	f	\N	2023-08-01 20:22:54	2023-08-04 14:40:43	\N
e018a51e-e7bf-41b9-954d-8ad4737b58b5	Jabez Kassa	jabez.kassa@ienetworks.co	\N	$2y$10$ZfKv0JGqFRxQKi7KHwoICeJGfsmZITfT4ghDi0EOcZq5ZZ0gyZMGG	\N	\N	f	\N	2023-06-09 13:59:03	2023-06-09 13:59:03	\N
e04c15b4-1d8b-445f-8ca9-531f4b9922c2	Tesfamichael Aboset	tesfamichael.aboset@ienetworksolutions.com	\N	$2y$10$O0EVdxcJJZdJeEd4dM4Ejet/xqdnKxp.tyemVmGqGopfyE5GQuAZa	\N	\N	f	\N	2023-04-28 12:49:35	2023-04-28 12:51:21	\N
e0c0d17e-2c04-4b90-9905-3cf04f38b4bd	Yeabsera Efrem	yeabsera.e@ienetworksolutions.com	\N	$2y$10$ZBZz1/nXq.QeBgumzM1EteyGEmb1RcdPk0Z.yDhZrYg3pTKlC1tae	\N	\N	f	\N	2023-07-28 15:13:04	2023-07-28 15:18:52	\N
e3e98f6e-e20c-4b24-9983-291c42e1e193	Betelihem Yoseph	betelihem.yoseph@ienetworksolutions.com	\N	$2y$10$XO75sjaf/ge8o777aP4ti.d7oiKlec5PyARV4jLHO6xtULqdSb7Wi	\N	\N	f	\N	2023-04-06 15:35:43	2023-04-06 15:57:53	\N
e60e2dd6-a0f4-4c67-b8c6-a37462a6ab06	Bilal Badwe	bilal@ienetworksolutions.com	\N	$2y$10$r9dvdTMQ6gA.TLQtInM7vuDe6trII4B8UQogZqdA4mlnj31hl6HAC	/ProfilePictures/1666961943-avatar-130-x1.avif		f	\N	2022-10-28 09:59:03	2022-11-11 12:58:33	\N
e812f4ce-ca6d-42f7-988b-00d4dd6f6021	Gelantu Tesfaye	gelantu@ienetworks.co	\N	$2y$10$2NVdCDLN4uFMbmf.VZLHq.vy8U4ZNfjGZhE9KAcEan8rcTvdsoHaa	\N		f	\N	2022-12-23 09:56:51	2022-12-23 09:56:51	\N
e990a1e1-c68e-495e-a8b4-78ebeaf6f252	Yonatan Moges	yonatan@ienetworksolutions.com	\N	$2y$10$W74iakDzHeRmpA.9WJsV.eReCX//lv45syiSrWWswWwnjdUPEr4Xq	\N		f	\N	2023-01-30 15:06:10	2023-01-30 15:06:10	\N
eafa7e7b-90a3-461c-b186-0d4b45262ece	Amanuel Alemayehu	amanuel.a@ienetworksolutions.com	\N	$2y$10$C6ZK4rPpNuaUz.UqNYBOFu19RflIpCerFKP9Tws38uxJRKJONtVsm	\N	\N	f	\N	2023-05-03 13:48:04	2023-05-03 14:20:37	\N
eb25f30a-4136-43ab-a64e-8f85ad179a61	Hawi Tesfaye	hawi@ienetworks.co	\N	$2y$10$6HpvbpyAJ5nfnbpPLfdPJuu1VLHx2.Swec/pyYPDihr8ac7bi5ibm	\N		f	\N	2022-11-07 13:41:04	2022-11-07 14:02:02	\N
ee19448b-a982-4397-8cb2-5da2b934fb20	Hiluf Meressa	hiluf.meressa@ienetworksolutions.com	\N	$2y$10$..Iwk/aGmZw15y7yFeAd9OGTDWFJg9uDE9RxNem5yc/TBEWVAOGNW	\N	/signatures/1686059495-diV2HP0h_400x400.jpg	f	\N	2023-06-01 21:15:23	2023-06-06 20:51:35	\N
ef883a45-0e34-4612-bd9a-feaf093dc2be	Meseret Gete	menilik@ienetworksolutions.com	\N	$2y$10$auf3NCOc/3wZ4rdg3ouyBux45wfA67wN0q.AOBwg7ZuY1VaJ8DgPy	\N	\N	f	\N	2023-05-25 11:36:57	2023-05-25 11:36:57	\N
f054a705-2819-45fa-980e-1bef47798796	Kalkidan Seifu	kalkidan@ienetworksolutions.com	\N	$2y$10$CBiJRKZ7Drnt95YWplklWeZOMs4yLVcy8epfd.BcGGdpZsdlqwKcq	\N		f	\N	2022-12-08 14:03:14	2023-05-18 22:25:51	\N
f3af5e6c-15c0-4b47-9422-ce75068e474a	Masresha Melisse	masresha.melisse@ienetworksolutions.com	\N	$2y$10$wg8mb.h3JRhP.S75W9kXfem3AjFIQIp2SaKhO41FgTHRDr0D30x82	\N	\N	f	\N	2023-07-24 13:03:35	2023-07-24 13:03:35	\N
fa669931-84c0-48cc-ab93-d0c762465fc2	Yodit Kassahun	yodit.k@ienetworksolutions.com	\N	$2y$10$a29URgMkkBUL9US0rPR9COS7vnjfrA/./lTNFjvbfNaCgz8QHVqwG	\N		f	\N	2022-10-22 04:23:05	2022-10-22 07:41:38	\N
fb4055bd-a66f-4695-acba-da24f2bc2df0	Gebreabzgi  Aregawi	gebreabzgi.aregawi@ienetworks.co	\N	$2y$10$zqqIrUFUWLygsKzUTTTzau9g2a5nz7X/77cZM2QMr8vXGV7zvkuEu	\N		f	\N	2023-02-27 15:27:54	2023-02-27 15:27:54	\N
fb676481-e015-484d-bc44-b006f9cf489b	Kirubel Tesfaye	kirubel.t@ienetworks.co	\N	$2y$10$1qIzUYN0PxhIqi.mQZPSueljbjUsRNmvwfEUSunxEX9MG4zx.91Ge	\N		f	\N	2023-01-17 21:28:43	2023-01-18 12:30:43	\N
471a616d-043b-4049-8d11-9330d41ab0b2	ABc	abselomge@ienetworks.co	\N	\N	\N	\N	\N	\N	2023-08-30 19:50:28	2023-08-30 19:50:28	\N
d7186d80-5c47-4681-affa-d39cd6038a4b	ABc	abselomgeb@ienetworks.co	\N	\N	\N	\N	f	\N	2023-08-30 19:54:39	2023-08-30 20:05:34	0e324e94-6f2c-415c-9a46-a359a96fea7f
c0df47cc-0efe-4612-8b0c-3e814296fab3	ABc	abselomgebrekidannnn@ienetworks.co	\N	\N	\N	\N	\N	\N	2023-09-04 09:09:01	2023-09-04 09:09:01	0e324e94-6f2c-415c-9a46-a359a96fea7f
5a53895e-a8c8-49f7-a353-780b3ab2209d	Surafel Kifle	surafel@ienetworks.co	\N	$2y$10$cuVrlyH4SFPDNT3ON5UTkO51mfKvTbbK49MAOUwPhxcQ65JzYgu0e	/ProfilePictures/1667537457-surafel.jfif	/signatures/1678793960-photo1678793881.jpeg	f	\N	2022-11-03 18:43:47	2023-09-05 16:57:41	aac43506-4184-48a8-9873-a1849dc1d8ee
\.


--
-- Data for Name: weekly_report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weekly_report (id, "createdAt", "updatedAt", "createdBy", "updatedBy", year, month, week, "sleepingTasks", "nextWeekTasks", risks, issues, "overAllProgress", "isApproved", "projectId") FROM stdin;
b28871d4-2251-40fc-b0ed-72bf77327b40	2023-09-05 10:09:16.723477	2023-09-05 10:09:16.723477	\N	\N	2023	9	1	[{"id":"16d4f5df-1a36-436c-ab54-85ea715b4f49","createdAt":"2023-09-05T05:27:54.370Z","updatedAt":"2023-09-05T05:27:54.370Z","createdBy":null,"updatedBy":null,"name":"Task One","plannedStart":"2023-09-09","plannedFinish":"2023-09-11","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"526a07bb-a1d6-47be-b908-016aae3ac07b"}]	[]	[{"id":"1769a0f8-3dc6-47b0-b186-10d6e5d64177","createdAt":"2023-09-05T05:55:36.040Z","updatedAt":"2023-09-05T05:55:36.040Z","createdBy":null,"updatedBy":null,"riskDescription":"Delay on CISCO switch delivery","causedBy":"delay","consequences":"schedule extension updated","riskOwner":"Kirubel","status":"Transfered","controlOwner":"adsklfjlk","control":"Transfered","probability":"High","impact":"High","riskRate":"Critical","residualProbability":"High","residualImpact":"Medium","residualRiskRate":"Severe","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"}]	[{"id":"1769a0f8-3dc6-47b0-b186-10d6e5d64177","createdAt":"2023-09-05T06:01:52.217Z","updatedAt":"2023-09-05T05:55:36.040Z","createdBy":null,"updatedBy":null,"riskDescription":"Delay on CISCO switch delivery","causedBy":"delay","consequences":"schedule extension updated","riskOwner":"Kirubel","status":"Open","impact":"High","control":"Transfered","controlOwner":"adsklfjlk","residualImpact":"Medium","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"},{"id":"b7a1ccbe-7a2d-4ff0-8cf0-aa2076493285","createdAt":"2023-09-05T06:02:51.683Z","updatedAt":"2023-09-05T06:02:51.683Z","createdBy":null,"updatedBy":null,"riskDescription":"Issue on materials","causedBy":"sdfghjklasdfg","consequences":"asdfgfds","riskOwner":"Kdirubel","status":"Open","impact":"High","control":"Avoided","controlOwner":"fghjh","residualImpact":"High","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"}]	[{"id":"16d4f5df-1a36-436c-ab54-85ea715b4f49","createdAt":"2023-09-05T05:27:54.370Z","updatedAt":"2023-09-05T05:27:54.370Z","createdBy":null,"updatedBy":null,"name":"Task One","plannedStart":"2023-09-09","plannedFinish":"2023-09-11","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"526a07bb-a1d6-47be-b908-016aae3ac07b","baseline":{"id":"526a07bb-a1d6-47be-b908-016aae3ac07b","createdAt":"2023-09-05T05:27:54.326Z","updatedAt":"2023-09-05T05:27:54.326Z","createdBy":null,"updatedBy":null,"name":"Second Baseline","status":true,"milestoneId":"a0609082-fc07-473d-bc53-dd9f8fe8f577","milestone":{"id":"a0609082-fc07-473d-bc53-dd9f8fe8f577","createdAt":"2023-09-05T05:13:35.323Z","updatedAt":"2023-09-05T05:13:35.323Z","createdBy":null,"updatedBy":null,"name":"Milestone 1","status":true,"weight":5,"projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41","paymentTermId":"78c300d2-523c-41e6-b9dd-7b0d9abe8cea","project":{"id":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41","createdAt":"2023-09-05T05:12:46.746Z","updatedAt":"2023-09-05T05:12:46.746Z","createdBy":null,"updatedBy":null,"name":"Demo Project","clientId":null,"milestone":5,"budget":100000,"contract_sign_date":"2023-09-05","planned_end_date":"2023-11-23","lc_opening_date":"2023-09-06","advanced_payment_date":"2023-09-06","status":true}}}}]	f	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
7911590e-b497-4f26-a82f-d4235401f293	2023-09-05 11:48:30.813693	2023-09-05 11:48:30.813693	\N	\N	2023	9	1	[{"id":"406b6b24-dac8-4337-9c10-e581e2c8c4e7","createdAt":"2023-09-05T08:14:36.954Z","updatedAt":"2023-09-05T08:14:36.954Z","createdBy":null,"updatedBy":null,"name":"Task one","plannedStart":"2023-09-05","plannedFinish":"2023-09-13","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"asdfghjklhgfdsdfgh","baselineId":"a9a2a134-0c82-4213-9f91-78ffcf45054f"}]	[]	[{"id":"36e0aad3-c70c-438c-9fc1-b450395031ee","createdAt":"2023-09-05T08:36:47.167Z","updatedAt":"2023-09-05T08:36:47.167Z","createdBy":null,"updatedBy":null,"riskDescription":"Description","causedBy":"Caused By","consequences":"Consequences","riskOwner":"Nana","status":"Transfered","controlOwner":"Controll Owner","control":"Transfered","probability":"High","impact":"High","riskRate":"Critical","residualProbability":"Medium","residualImpact":"High","residualRiskRate":"Severe","projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0"}]	[{"id":"36e0aad3-c70c-438c-9fc1-b450395031ee","createdAt":"2023-09-05T08:37:13.447Z","updatedAt":"2023-09-05T08:36:47.167Z","createdBy":null,"updatedBy":null,"riskDescription":"Description","causedBy":"Caused By","consequences":"Consequences","riskOwner":"Nana","status":"Open","impact":"High","control":"Transfered","controlOwner":"Controll Owner","residualImpact":"High","projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0"},{"id":"b876989b-fad6-4319-a1be-d620617e4d7e","createdAt":"2023-09-05T08:37:58.814Z","updatedAt":"2023-09-05T08:37:58.814Z","createdBy":null,"updatedBy":null,"riskDescription":"Risk Description","causedBy":"Caused By","consequences":"Consequences","riskOwner":"Risk Owner","status":"Closed","impact":"High","control":"Avoided","controlOwner":"Risk Owner","residualImpact":"Medium","projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0"}]	[{"id":"406b6b24-dac8-4337-9c10-e581e2c8c4e7","createdAt":"2023-09-05T08:14:36.954Z","updatedAt":"2023-09-05T08:14:36.954Z","createdBy":null,"updatedBy":null,"name":"Task one","plannedStart":"2023-09-05","plannedFinish":"2023-09-13","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"asdfghjklhgfdsdfgh","baselineId":"a9a2a134-0c82-4213-9f91-78ffcf45054f","baseline":{"id":"a9a2a134-0c82-4213-9f91-78ffcf45054f","createdAt":"2023-09-05T08:14:36.926Z","updatedAt":"2023-09-05T08:14:36.926Z","createdBy":null,"updatedBy":null,"name":"Baseline","status":true,"milestoneId":"bc0a673e-42d3-4457-9091-6f838a36e13b","milestone":{"id":"bc0a673e-42d3-4457-9091-6f838a36e13b","createdAt":"2023-09-05T08:13:09.650Z","updatedAt":"2023-09-05T08:13:09.650Z","createdBy":null,"updatedBy":null,"name":"Milestone 1","status":true,"weight":100,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","paymentTermId":"d37b2bed-a6b3-4fb7-aeda-b4e7905bf1a5","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true}}}}]	f	b121be11-cbcc-41b0-89e4-8e4a289d04b0
3af3ef11-a7a3-4f31-b21b-0fe4393c5c1a	2023-09-20 15:25:56.994138	2023-09-20 15:25:56.994138	\N	\N	2023	9	3	[]	[{"id":"8f53b412-a26d-4102-9a24-e9721f3845ed","createdAt":"2023-09-14T06:37:46.872Z","updatedAt":"2023-09-14T06:37:46.872Z","createdBy":null,"updatedBy":null,"name":"ytfrtyyutuytu","plannedStart":"2023-09-26","plannedFinish":"2023-09-26","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"b98444f7-24e2-42d3-a990-568ca64b59cd"}]	[{"id":"0588b631-2218-4d87-8e5e-e2ad74eb55c4","createdAt":"2023-09-20T12:11:14.266Z","updatedAt":"2023-09-20T12:11:14.266Z","createdBy":null,"updatedBy":null,"riskDescription":"Risk Description","causedBy":"cause","consequences":"Consequences","riskOwner":"Kirubel","status":"Closed","controlOwner":"adsklfjlk","control":"Transfered","probability":"High","impact":"Very-High","riskRate":"Critical","residualProbability":"High","residualImpact":"High","residualRiskRate":"Critical","projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0"},{"id":"f223af24-26bc-455b-aa24-2b7a4fa9637d","createdAt":"2023-09-20T12:14:10.812Z","updatedAt":"2023-09-20T12:14:10.812Z","createdBy":null,"updatedBy":null,"riskDescription":"New Issue","causedBy":"Cause by","consequences":"asdfgfds","riskOwner":"Nana","status":"Transfered","controlOwner":"adsklfjlk","control":"Mitigated","probability":"Medium","impact":"Medium","riskRate":"Moderate","residualProbability":"Medium","residualImpact":"Medium","residualRiskRate":"Moderate","projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0"}]	[{"id":"f223af24-26bc-455b-aa24-2b7a4fa9637d","createdAt":"2023-09-20T12:14:22.126Z","updatedAt":"2023-09-20T12:14:10.812Z","createdBy":null,"updatedBy":null,"riskDescription":"New Issue","causedBy":"Cause by","consequences":"asdfgfds","riskOwner":"Nana","status":"Open","impact":"Medium","control":"Mitigated","controlOwner":"adsklfjlk","residualImpact":"Medium","projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0"}]	[{"id":"8f53b412-a26d-4102-9a24-e9721f3845ed","createdAt":"2023-09-14T06:37:46.872Z","updatedAt":"2023-09-14T06:37:46.872Z","createdBy":null,"updatedBy":null,"name":"ytfrtyyutuytu","plannedStart":"2023-09-26","plannedFinish":"2023-09-26","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"b98444f7-24e2-42d3-a990-568ca64b59cd","baseline":{"id":"b98444f7-24e2-42d3-a990-568ca64b59cd","createdAt":"2023-09-14T06:37:46.776Z","updatedAt":"2023-09-14T06:37:46.776Z","createdBy":null,"updatedBy":null,"name":"asdfghj","status":true,"milestoneId":"a1905b4a-982c-401b-81c1-6a5fc0ed59ea","milestone":{"id":"a1905b4a-982c-401b-81c1-6a5fc0ed59ea","createdAt":"2023-09-05T08:17:15.322Z","updatedAt":"2023-09-05T08:17:15.322Z","createdBy":null,"updatedBy":null,"name":"Milestone 2","status":true,"weight":100,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","paymentTermId":"8c535341-977a-4fc0-8dcc-4327fe1d3535","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}}}]	f	b121be11-cbcc-41b0-89e4-8e4a289d04b0
022bdb73-c38c-4571-a885-7a56c892ed5b	2023-10-27 16:59:16.958289	2023-10-27 16:59:16.958289	\N	\N	2023	10	4	[]	[{"id":"703bd7e7-9cf9-44d1-a739-f91f79ab280c","createdAt":"2023-10-05T19:36:28.095Z","updatedAt":"2023-10-05T19:36:28.095Z","createdBy":null,"updatedBy":null,"name":"taskkker","plannedStart":"2023-10-29","plannedFinish":"2023-11-05","actualStart":null,"actualFinish":null,"completion":100,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"638a4536-a58b-4ebe-9d81-9dbff5e7f73b","milestoneId":"0ece0b2f-b416-40e5-b0b2-5090870c945d"}]	[{"id":"d1ba10cd-2978-4ca6-ab45-2899cb90728e","createdAt":"2023-09-25T09:22:46.838Z","updatedAt":"2023-09-25T09:22:46.838Z","createdBy":null,"updatedBy":null,"riskDescription":"RIsk","causedBy":"Caaa","consequences":"Cons","riskOwner":"asldjf","status":"Open","controlOwner":"sdf","control":"asdfkj","probability":"Very-High","impact":"Very-High","riskRate":"Critical","residualProbability":"Very-High","residualImpact":"Very-High","residualRiskRate":"Critical","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"},{"id":"233bac0c-4393-490f-8f44-471025575078","createdAt":"2023-09-25T09:22:49.108Z","updatedAt":"2023-09-25T09:22:49.108Z","createdBy":null,"updatedBy":null,"riskDescription":"RIsk","causedBy":"Caaa","consequences":"Cons","riskOwner":"asldjf","status":"Open","controlOwner":"sdf","control":"asdfkj","probability":"Very-High","impact":"Very-High","riskRate":"Critical","residualProbability":"Very-High","residualImpact":"Very-High","residualRiskRate":"Critical","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"},{"id":"3b5fbf8e-0944-4ba7-8c2c-3c8f83d9406c","createdAt":"2023-09-25T09:22:49.826Z","updatedAt":"2023-09-25T09:22:49.826Z","createdBy":null,"updatedBy":null,"riskDescription":"RIsk","causedBy":"Caaa","consequences":"Cons","riskOwner":"asldjf","status":"Open","controlOwner":"sdf","control":"asdfkj","probability":"Very-High","impact":"Very-High","riskRate":"Critical","residualProbability":"Very-High","residualImpact":"Very-High","residualRiskRate":"Critical","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"}]	[{"id":"dff6d9df-6f86-4c4f-a1a3-241ca651e1ee","createdAt":"2023-09-15T06:51:15.584Z","updatedAt":"2023-09-14T16:25:04.511Z","createdBy":null,"updatedBy":null,"riskDescription":"New Issue","causedBy":"asjd ck","consequences":"akjnsdkj","riskOwner":"aoiwnedcjna","status":"Open","impact":"High","control":"Mitigated","controlOwner":"Risk Owner","residualImpact":"Medium","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"},{"id":"d7f72ed7-d982-4de1-bda6-e2960b3630ab","createdAt":"2023-09-25T07:34:08.804Z","updatedAt":"2023-09-15T06:52:44.837Z","createdBy":null,"updatedBy":null,"riskDescription":"Risk Description","causedBy":"reason","consequences":"Consequences","riskOwner":"Kirubel","status":"Open","impact":"High","control":"Mklkdlsajlkfj","controlOwner":"fd","residualImpact":"High","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"},{"id":"9538403b-c23c-48bd-8ee7-39d5dd2a16f1","createdAt":"2023-09-25T07:51:19.511Z","updatedAt":"2023-09-25T07:50:54.869Z","createdBy":null,"updatedBy":null,"riskDescription":"Risk Risk","causedBy":"Cause","consequences":"Conseq","riskOwner":"sdaljflk","status":"Open","impact":"Very-High","control":"sadfkj","controlOwner":"asdf","residualImpact":"Very-High","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"},{"id":"577bf26c-0b0f-4356-b773-6bf095e7a60a","createdAt":"2023-09-25T12:29:51.800Z","updatedAt":"2023-09-25T08:57:22.148Z","createdBy":null,"updatedBy":null,"riskDescription":"New RIsk","causedBy":"Caos","consequences":"COmnsq","riskOwner":"Nanq","status":"Open","impact":"Very-High","control":"asdkfjkl","controlOwner":"sdaklfj","residualImpact":"Very-High","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"},{"id":"5a08cefc-3e95-4b04-b67d-77111814d68c","createdAt":"2023-10-12T06:14:58.719Z","updatedAt":"2023-10-12T06:14:58.719Z","createdBy":null,"updatedBy":null,"riskDescription":"Risk","causedBy":"Cause","consequences":"conseq","riskOwner":"Risk","status":"Open","impact":"Very High","control":"Accepted","controlOwner":"klsdjflkj","residualImpact":"Very High","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"},{"id":"8c78623d-f849-4524-a086-5fe88f93661b","createdAt":"2023-10-27T13:50:16.899Z","updatedAt":"2023-09-26T13:52:41.496Z","createdBy":null,"updatedBy":null,"riskDescription":"Issue Test ","causedBy":"Betty","consequences":"Delay","riskOwner":"betty","status":"Open","impact":"Medium","control":"Mitigated","controlOwner":"betty","residualImpact":"High","projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41"}]	[{"id":"703bd7e7-9cf9-44d1-a739-f91f79ab280c","createdAt":"2023-10-05T19:36:28.095Z","updatedAt":"2023-10-05T19:36:28.095Z","createdBy":null,"updatedBy":null,"name":"taskkker","plannedStart":"2023-10-29","plannedFinish":"2023-11-05","actualStart":null,"actualFinish":null,"completion":100,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"638a4536-a58b-4ebe-9d81-9dbff5e7f73b","milestoneId":"0ece0b2f-b416-40e5-b0b2-5090870c945d","baseline":{"id":"638a4536-a58b-4ebe-9d81-9dbff5e7f73b","createdAt":"2023-10-05T19:36:27.861Z","updatedAt":"2023-10-05T19:36:27.861Z","createdBy":null,"updatedBy":null,"name":"base base bsaaaaaaaaaaaaaasdc","status":true,"projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41","project":{"id":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41","createdAt":"2023-09-05T05:12:46.746Z","updatedAt":"2023-09-05T05:12:46.746Z","createdBy":null,"updatedBy":null,"name":"Demo Project","clientId":null,"milestone":5,"budget":100000,"contract_sign_date":"2023-09-05","planned_end_date":"2023-11-23","lc_opening_date":"2023-09-06","advanced_payment_date":"2023-09-06","status":true,"isOffice":false}}},{"id":"afc8d3b4-9aa7-4daa-9d38-9c54760f6344","createdAt":"2023-10-05T19:36:28.039Z","updatedAt":"2023-10-05T19:36:28.039Z","createdBy":null,"updatedBy":null,"name":"task","plannedStart":"2023-10-15","plannedFinish":"2023-10-20","actualStart":null,"actualFinish":null,"completion":60,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"638a4536-a58b-4ebe-9d81-9dbff5e7f73b","milestoneId":"0ece0b2f-b416-40e5-b0b2-5090870c945d","baseline":{"id":"638a4536-a58b-4ebe-9d81-9dbff5e7f73b","createdAt":"2023-10-05T19:36:27.861Z","updatedAt":"2023-10-05T19:36:27.861Z","createdBy":null,"updatedBy":null,"name":"base base bsaaaaaaaaaaaaaasdc","status":true,"projectId":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41","project":{"id":"7eba6dd1-4188-41c8-b1d2-63e8b82f8c41","createdAt":"2023-09-05T05:12:46.746Z","updatedAt":"2023-09-05T05:12:46.746Z","createdBy":null,"updatedBy":null,"name":"Demo Project","clientId":null,"milestone":5,"budget":100000,"contract_sign_date":"2023-09-05","planned_end_date":"2023-11-23","lc_opening_date":"2023-09-06","advanced_payment_date":"2023-09-06","status":true,"isOffice":false}}}]	f	7eba6dd1-4188-41c8-b1d2-63e8b82f8c41
3e786da4-8e1a-4207-89d7-1be5f50c2570	2023-11-01 17:15:37.086352	2023-11-01 17:15:37.086352	\N	\N	2023	11	1	[{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"},{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"},{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"},{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"},{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"}]	[{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751"}]	[]	[]	[{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"9877eb3e-fa06-4c90-9b0e-965c291c1183","createdAt":"2023-10-31T08:49:10.559Z","updatedAt":"2023-10-31T08:49:10.559Z","createdBy":null,"updatedBy":null,"name":"task2","plannedStart":"2023-10-09","plannedFinish":"2023-10-24","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"9877eb3e-fa06-4c90-9b0e-965c291c1183","createdAt":"2023-10-31T08:49:10.559Z","updatedAt":"2023-10-31T08:49:10.559Z","createdBy":null,"updatedBy":null,"name":"task2","plannedStart":"2023-10-09","plannedFinish":"2023-10-24","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"9877eb3e-fa06-4c90-9b0e-965c291c1183","createdAt":"2023-10-31T08:49:10.559Z","updatedAt":"2023-10-31T08:49:10.559Z","createdBy":null,"updatedBy":null,"name":"task2","plannedStart":"2023-10-09","plannedFinish":"2023-10-24","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"9877eb3e-fa06-4c90-9b0e-965c291c1183","createdAt":"2023-10-31T08:49:10.559Z","updatedAt":"2023-10-31T08:49:10.559Z","createdBy":null,"updatedBy":null,"name":"task2","plannedStart":"2023-10-09","plannedFinish":"2023-10-24","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"a1d291ef-6cc3-4525-bf45-e5fef2ff39ac","createdAt":"2023-10-31T08:49:10.555Z","updatedAt":"2023-10-31T08:49:10.555Z","createdBy":null,"updatedBy":null,"name":"task 1","plannedStart":"2023-10-30","plannedFinish":"2023-10-31","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":"gvtfcdx","baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"9877eb3e-fa06-4c90-9b0e-965c291c1183","createdAt":"2023-10-31T08:49:10.559Z","updatedAt":"2023-10-31T08:49:10.559Z","createdBy":null,"updatedBy":null,"name":"task2","plannedStart":"2023-10-09","plannedFinish":"2023-10-24","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}},{"id":"c324f341-0a97-4847-b1f6-35081fe49108","createdAt":"2023-10-31T08:49:10.560Z","updatedAt":"2023-10-31T08:49:10.560Z","createdBy":null,"updatedBy":null,"name":"task 3","plannedStart":"2023-11-10","plannedFinish":"2023-11-18","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","milestoneId":"41d45917-8f2f-476f-b03e-180b3b0d6751","baseline":{"id":"1207eaaf-1498-4c5a-bb26-114e67a98d6e","createdAt":"2023-10-31T08:49:10.471Z","updatedAt":"2023-10-31T08:49:10.471Z","createdBy":null,"updatedBy":null,"name":"base era","status":true,"projectId":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","project":{"id":"b121be11-cbcc-41b0-89e4-8e4a289d04b0","createdAt":"2023-09-05T08:05:26.797Z","updatedAt":"2023-09-05T08:05:26.797Z","createdBy":null,"updatedBy":null,"name":"ERA MOTI","clientId":null,"milestone":5,"budget":1000,"contract_sign_date":"2023-09-13","planned_end_date":"2023-11-30","lc_opening_date":"2023-09-30","advanced_payment_date":"2023-09-30","status":true,"isOffice":false}}}]	f	b121be11-cbcc-41b0-89e4-8e4a289d04b0
ab5fc9e3-57e4-442d-961a-473e69a9f64e	2023-12-04 15:38:54.681858	2023-12-04 15:38:54.681858	\N	\N	2023	12	1	[]	[{"id":"846f3664-b597-4b9e-b6aa-c057fbe0dceb","createdAt":"2023-12-04T11:39:05.741Z","updatedAt":"2023-12-04T11:39:05.741Z","createdBy":null,"updatedBy":null,"name":"shippment","plannedStart":"2023-12-11","plannedFinish":"2023-12-14","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"09ccbb10-2223-4420-ba9f-8e4e7b5c59e3","predecessor":"0"},{"id":"eecec2d0-4162-4d5f-8590-a481002e9c1e","createdAt":"2023-12-04T11:39:05.738Z","updatedAt":"2023-12-04T11:39:05.738Z","createdBy":null,"updatedBy":null,"name":"implimentation","plannedStart":"2023-12-15","plannedFinish":"2024-01-10","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"858cbd7c-d67d-41e7-9d60-1b8b8ec4cfca","predecessor":"1"},{"id":"846f3664-b597-4b9e-b6aa-c057fbe0dceb","createdAt":"2023-12-04T11:39:05.741Z","updatedAt":"2023-12-04T11:39:05.741Z","createdBy":null,"updatedBy":null,"name":"shippment","plannedStart":"2023-12-11","plannedFinish":"2023-12-14","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"09ccbb10-2223-4420-ba9f-8e4e7b5c59e3","predecessor":"0"},{"id":"eecec2d0-4162-4d5f-8590-a481002e9c1e","createdAt":"2023-12-04T11:39:05.738Z","updatedAt":"2023-12-04T11:39:05.738Z","createdBy":null,"updatedBy":null,"name":"implimentation","plannedStart":"2023-12-15","plannedFinish":"2024-01-10","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"858cbd7c-d67d-41e7-9d60-1b8b8ec4cfca","predecessor":"1"},{"id":"846f3664-b597-4b9e-b6aa-c057fbe0dceb","createdAt":"2023-12-04T11:39:05.741Z","updatedAt":"2023-12-04T11:39:05.741Z","createdBy":null,"updatedBy":null,"name":"shippment","plannedStart":"2023-12-11","plannedFinish":"2023-12-14","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"09ccbb10-2223-4420-ba9f-8e4e7b5c59e3","predecessor":"0"},{"id":"eecec2d0-4162-4d5f-8590-a481002e9c1e","createdAt":"2023-12-04T11:39:05.738Z","updatedAt":"2023-12-04T11:39:05.738Z","createdBy":null,"updatedBy":null,"name":"implimentation","plannedStart":"2023-12-15","plannedFinish":"2024-01-10","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"858cbd7c-d67d-41e7-9d60-1b8b8ec4cfca","predecessor":"1"}]	[{"id":"f827301d-9d0e-4a8d-a3cd-b9eeef9f2b16","createdAt":"2023-12-04T12:28:54.657Z","updatedAt":"2023-12-04T12:28:54.657Z","createdBy":null,"updatedBy":null,"riskDescription":"Issue description","causedBy":"Reason","consequences":"damage","riskOwner":"surafel kifle","status":"Closed","controlOwner":"surafel","control":"Transfered","probability":"Very-High","impact":"Very-High","riskRate":"Critical","residualProbability":"High","residualImpact":"Medium","residualRiskRate":"Severe","projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab"},{"id":"16683e1b-9f95-4e71-8159-d4fa56b4911d","createdAt":"2023-12-04T12:35:07.526Z","updatedAt":"2023-12-04T12:35:07.526Z","createdBy":null,"updatedBy":null,"riskDescription":"Issue descriptionbj","causedBy":"Reason","consequences":"damage","riskOwner":"surafel kifle","status":"Open","controlOwner":"surafel","control":"Transfered","probability":"High","impact":"Low","riskRate":"Moderate","residualProbability":"Very-High","residualImpact":"High","residualRiskRate":"Critical","projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab"},{"id":"9b4f945c-d9c6-4f05-ae12-3d8bcb48fb68","createdAt":"2023-12-04T12:35:06.379Z","updatedAt":"2023-12-04T12:35:06.379Z","createdBy":null,"updatedBy":null,"riskDescription":"Issue descriptionbj","causedBy":"Reason","consequences":"damage","riskOwner":"surafel kifle","status":"Transfered","controlOwner":"surafel","control":"Transfered","probability":"High","impact":"Low","riskRate":"Moderate","residualProbability":"Very-High","residualImpact":"High","residualRiskRate":"Critical","projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab"}]	[{"id":"9b4f945c-d9c6-4f05-ae12-3d8bcb48fb68","createdAt":"2023-12-04T12:35:36.766Z","updatedAt":"2023-12-04T12:35:06.379Z","createdBy":null,"updatedBy":null,"riskDescription":"Issue descriptionbj","causedBy":"Reason","consequences":"damage","riskOwner":"surafel kifle","status":"Open","impact":"Low","control":"Transfered","controlOwner":"surafel","residualImpact":"High","projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab"},{"id":"07b8c1f1-a75d-461f-8667-aa3f452e160b","createdAt":"2023-12-04T12:36:17.807Z","updatedAt":"2023-12-04T12:36:17.807Z","createdBy":null,"updatedBy":null,"riskDescription":"Issue description","causedBy":"Reason","consequences":"damage","riskOwner":"surafel kifle","status":"Open","impact":"Low","control":"Transfered","controlOwner":"surafel","residualImpact":"Very High","projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab"}]	[{"id":"0cdc3287-f398-4e29-ad37-798e45b00657","createdAt":"2023-12-04T11:39:05.725Z","updatedAt":"2023-12-04T11:39:05.725Z","createdBy":null,"updatedBy":null,"name":"order item","plannedStart":"2023-12-05","plannedFinish":"2023-12-08","actualStart":"2023-12-20","actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"80bc2479-6cea-44ce-9622-528c4a981ddf","predecessor":"","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}},{"id":"846f3664-b597-4b9e-b6aa-c057fbe0dceb","createdAt":"2023-12-04T11:39:05.741Z","updatedAt":"2023-12-04T11:39:05.741Z","createdBy":null,"updatedBy":null,"name":"shippment","plannedStart":"2023-12-11","plannedFinish":"2023-12-14","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"09ccbb10-2223-4420-ba9f-8e4e7b5c59e3","predecessor":"0","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}},{"id":"eecec2d0-4162-4d5f-8590-a481002e9c1e","createdAt":"2023-12-04T11:39:05.738Z","updatedAt":"2023-12-04T11:39:05.738Z","createdBy":null,"updatedBy":null,"name":"implimentation","plannedStart":"2023-12-15","plannedFinish":"2024-01-10","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"858cbd7c-d67d-41e7-9d60-1b8b8ec4cfca","predecessor":"1","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}},{"id":"0cdc3287-f398-4e29-ad37-798e45b00657","createdAt":"2023-12-04T11:39:05.725Z","updatedAt":"2023-12-04T11:39:05.725Z","createdBy":null,"updatedBy":null,"name":"order item","plannedStart":"2023-12-05","plannedFinish":"2023-12-08","actualStart":"2023-12-20","actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"80bc2479-6cea-44ce-9622-528c4a981ddf","predecessor":"","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}},{"id":"846f3664-b597-4b9e-b6aa-c057fbe0dceb","createdAt":"2023-12-04T11:39:05.741Z","updatedAt":"2023-12-04T11:39:05.741Z","createdBy":null,"updatedBy":null,"name":"shippment","plannedStart":"2023-12-11","plannedFinish":"2023-12-14","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"09ccbb10-2223-4420-ba9f-8e4e7b5c59e3","predecessor":"0","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}},{"id":"eecec2d0-4162-4d5f-8590-a481002e9c1e","createdAt":"2023-12-04T11:39:05.738Z","updatedAt":"2023-12-04T11:39:05.738Z","createdBy":null,"updatedBy":null,"name":"implimentation","plannedStart":"2023-12-15","plannedFinish":"2024-01-10","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"858cbd7c-d67d-41e7-9d60-1b8b8ec4cfca","predecessor":"1","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}},{"id":"0cdc3287-f398-4e29-ad37-798e45b00657","createdAt":"2023-12-04T11:39:05.725Z","updatedAt":"2023-12-04T11:39:05.725Z","createdBy":null,"updatedBy":null,"name":"order item","plannedStart":"2023-12-05","plannedFinish":"2023-12-08","actualStart":"2023-12-20","actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"80bc2479-6cea-44ce-9622-528c4a981ddf","predecessor":"","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}},{"id":"846f3664-b597-4b9e-b6aa-c057fbe0dceb","createdAt":"2023-12-04T11:39:05.741Z","updatedAt":"2023-12-04T11:39:05.741Z","createdBy":null,"updatedBy":null,"name":"shippment","plannedStart":"2023-12-11","plannedFinish":"2023-12-14","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"09ccbb10-2223-4420-ba9f-8e4e7b5c59e3","predecessor":"0","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}},{"id":"eecec2d0-4162-4d5f-8590-a481002e9c1e","createdAt":"2023-12-04T11:39:05.738Z","updatedAt":"2023-12-04T11:39:05.738Z","createdBy":null,"updatedBy":null,"name":"implimentation","plannedStart":"2023-12-15","plannedFinish":"2024-01-10","actualStart":null,"actualFinish":null,"completion":0,"plannedCost":null,"actualCost":null,"status":true,"sleepingReason":null,"baselineId":"8249baf7-d96c-414d-b770-7ca8a5e9a836","milestoneId":"858cbd7c-d67d-41e7-9d60-1b8b8ec4cfca","predecessor":"1","baseline":{"id":"8249baf7-d96c-414d-b770-7ca8a5e9a836","createdAt":"2023-12-04T11:39:05.546Z","updatedAt":"2023-12-04T11:39:05.546Z","createdBy":null,"updatedBy":null,"name":"base one","status":true,"projectId":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","approved":false,"rejected":false,"project":{"id":"fe5ff3b6-2e2d-4702-a371-1a06e896ccab","createdAt":"2023-12-04T11:14:34.406Z","updatedAt":"2023-12-04T11:14:34.406Z","createdBy":null,"updatedBy":null,"name":"Checking Project","clientId":"012bdd24-3286-4670-9b82-70f6ef664b25","milestone":3,"budget":123,"contract_sign_date":"2023-12-05","planned_end_date":"2024-01-30","lc_opening_date":"2023-12-12","advanced_payment_date":"2023-12-30","status":true,"isOffice":false}}}]	f	fe5ff3b6-2e2d-4702-a371-1a06e896ccab
\.


--
-- Data for Name: weekly_report_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weekly_report_comment (id, "createdAt", "updatedAt", "createdBy", "updatedBy", comment, "weeklyReportId", "userId") FROM stdin;
f10d2ded-4236-4c32-a499-85aad8d9c6d0	2023-09-05 11:48:59.137098	2023-09-05 11:48:59.137098	\N	\N	njsndsgfs	7911590e-b497-4f26-a82f-d4235401f293	59258c1d-9735-40cb-94b9-02d0f4bd25ce
b8465958-aa57-4a75-a785-46d127c38b27	2023-09-05 12:09:33.360311	2023-09-05 12:09:33.360311	\N	\N	fcfcgf	7911590e-b497-4f26-a82f-d4235401f293	59258c1d-9735-40cb-94b9-02d0f4bd25ce
74c4ebeb-027c-48d3-9fee-93ff2d41e1f3	2023-09-20 15:26:54.032064	2023-09-20 15:26:54.032064	\N	\N	comment	3af3ef11-a7a3-4f31-b21b-0fe4393c5c1a	59258c1d-9735-40cb-94b9-02d0f4bd25ce
01a54e2c-f8c8-4f8a-bf7b-84056872d0fd	2023-10-27 17:01:16.446428	2023-10-27 17:01:16.446428	\N	\N	kkkkkkkkkk	022bdb73-c38c-4571-a885-7a56c892ed5b	59258c1d-9735-40cb-94b9-02d0f4bd25ce
8d3e9dc7-ff53-4428-854a-3b260f50b793	2023-12-04 15:39:54.614363	2023-12-04 15:39:54.614363	\N	\N	iuhivuejbhb vjhdjhbjhdsv	ab5fc9e3-57e4-442d-961a-473e69a9f64e	59258c1d-9735-40cb-94b9-02d0f4bd25ce
\.


--
-- Name: baseline_comment PK_02baca0689bb2dcf0a0be66f645; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baseline_comment
    ADD CONSTRAINT "PK_02baca0689bb2dcf0a0be66f645" PRIMARY KEY (id);


--
-- Name: subtasks PK_035c1c153f0239ecc95be448d96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subtasks
    ADD CONSTRAINT "PK_035c1c153f0239ecc95be448d96" PRIMARY KEY (id);


--
-- Name: budgetGroupComment PK_09b5fe4ecf27ec3585142df0101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."budgetGroupComment"
    ADD CONSTRAINT "PK_09b5fe4ecf27ec3585142df0101" PRIMARY KEY ("budgetGroupId", "budgetCommentId");


--
-- Name: milestones PK_0bdbfe399c777a6a8520ff902d9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT "PK_0bdbfe399c777a6a8520ff902d9" PRIMARY KEY (id);


--
-- Name: mom_actions PK_12e2ddc377185540fbb66169d0b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_actions
    ADD CONSTRAINT "PK_12e2ddc377185540fbb66169d0b" PRIMARY KEY (id);


--
-- Name: project_contract_values PK_1b589528656b568e47f132a0400; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_contract_values
    ADD CONSTRAINT "PK_1b589528656b568e47f132a0400" PRIMARY KEY (id);


--
-- Name: project_member PK_1f95533c37d5a7215c796d6ac9f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_member
    ADD CONSTRAINT "PK_1f95533c37d5a7215c796d6ac9f" PRIMARY KEY ("userId", "projectId");


--
-- Name: approval_module PK_23bba0606ed7a5de6a92a1180f1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_module
    ADD CONSTRAINT "PK_23bba0606ed7a5de6a92a1180f1" PRIMARY KEY (id);


--
-- Name: relatedissues PK_275a334c2ed5b8a776aecce26d0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relatedissues
    ADD CONSTRAINT "PK_275a334c2ed5b8a776aecce26d0" PRIMARY KEY (id);


--
-- Name: approval_level PK_3372e2ec91810c6d9933001759c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_level
    ADD CONSTRAINT "PK_3372e2ec91810c6d9933001759c" PRIMARY KEY (id);


--
-- Name: after_action_analysis_issue_related PK_37bc2f653fcbcb0bb5ce1952002; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.after_action_analysis_issue_related
    ADD CONSTRAINT "PK_37bc2f653fcbcb0bb5ce1952002" PRIMARY KEY (id);


--
-- Name: individualLL PK_3945dee2419cf429fe564d44e7a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."individualLL"
    ADD CONSTRAINT "PK_3945dee2419cf429fe564d44e7a" PRIMARY KEY (id);


--
-- Name: currency PK_3cda65c731a6264f0e444cc9b91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY (id);


--
-- Name: weekly_report PK_4d1d34740a604ed29e1a8ef5e23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_report
    ADD CONSTRAINT "PK_4d1d34740a604ed29e1a8ef5e23" PRIMARY KEY (id);


--
-- Name: mom_agenda PK_4f3f18edb5b959a736a59ea7989; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_agenda
    ADD CONSTRAINT "PK_4f3f18edb5b959a736a59ea7989" PRIMARY KEY (id);


--
-- Name: budget_group PK_541eb75f34f35ad5da18138d728; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_group
    ADD CONSTRAINT "PK_541eb75f34f35ad5da18138d728" PRIMARY KEY (id);


--
-- Name: approval_stage PK_5c1db9cb75171128c7753915d20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_stage
    ADD CONSTRAINT "PK_5c1db9cb75171128c7753915d20" PRIMARY KEY (id);


--
-- Name: baselines PK_6177fb1b69ff49ab766da9e3c7f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baselines
    ADD CONSTRAINT "PK_6177fb1b69ff49ab766da9e3c7f" PRIMARY KEY (id);


--
-- Name: projects PK_6271df0a7aed1d6c0691ce6ac50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY (id);


--
-- Name: afterActionAnalysis PK_6ab2025eb8ae0c4137ee168bcd6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."afterActionAnalysis"
    ADD CONSTRAINT "PK_6ab2025eb8ae0c4137ee168bcd6" PRIMARY KEY (id);


--
-- Name: mom_action_responsible PK_7033bb4ab183f31dceb1fe2b95e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_action_responsible
    ADD CONSTRAINT "PK_7033bb4ab183f31dceb1fe2b95e" PRIMARY KEY (id, "userId", "momActionId");


--
-- Name: minute_of_meetings PK_71253734f73bbbf164d88431de1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minute_of_meetings
    ADD CONSTRAINT "PK_71253734f73bbbf164d88431de1" PRIMARY KEY (id);


--
-- Name: AAA_Department PK_754b6e3b618760223d4857b63d8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AAA_Department"
    ADD CONSTRAINT "PK_754b6e3b618760223d4857b63d8" PRIMARY KEY ("afterActionAnalysisId", "departmentId");


--
-- Name: mom_agenda_topic PK_7ba2cff55e92bbc0b36190e1743; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_agenda_topic
    ADD CONSTRAINT "PK_7ba2cff55e92bbc0b36190e1743" PRIMARY KEY (id);


--
-- Name: actions PK_7bfb822f56be449c0b8adbf83cf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT "PK_7bfb822f56be449c0b8adbf83cf" PRIMARY KEY (id);


--
-- Name: budget_sessions PK_8042b36f36670ac8d28513ef579; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_sessions
    ADD CONSTRAINT "PK_8042b36f36670ac8d28513ef579" PRIMARY KEY (id);


--
-- Name: tasks PK_8d12ff38fcc62aaba2cab748772; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY (id);


--
-- Name: monthly_budgets PK_8dc0bc52b28641c6acda694484f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budgets
    ADD CONSTRAINT "PK_8dc0bc52b28641c6acda694484f" PRIMARY KEY (id);


--
-- Name: budget_task_category PK_99afb67da10dd7906a8b10f0d1b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_task_category
    ADD CONSTRAINT "PK_99afb67da10dd7906a8b10f0d1b" PRIMARY KEY (id);


--
-- Name: department PK_9a2213262c1593bffb581e382f5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY (id);


--
-- Name: budget PK_9af87bcfd2de21bd9630dddaa0e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY (id);


--
-- Name: llComments PK_9ccc73098e53756220cbe3ec852; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."llComments"
    ADD CONSTRAINT "PK_9ccc73098e53756220cbe3ec852" PRIMARY KEY (id);


--
-- Name: mom_comment PK_9cfd80bee6a6f89c2e92cff2219; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_comment
    ADD CONSTRAINT "PK_9cfd80bee6a6f89c2e92cff2219" PRIMARY KEY (id);


--
-- Name: issues PK_9d8ecbbeff46229c700f0449257; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT "PK_9d8ecbbeff46229c700f0449257" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: monthly_budget_comments PK_a50eebce6c2e83b1e4717bbe684; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budget_comments
    ADD CONSTRAINT "PK_a50eebce6c2e83b1e4717bbe684" PRIMARY KEY (id);


--
-- Name: budget_category PK_af6f95ccfa1f460edca6b488803; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_category
    ADD CONSTRAINT "PK_af6f95ccfa1f460edca6b488803" PRIMARY KEY (id);


--
-- Name: resourcehistories PK_b5ed459835d67814f109280943b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resourcehistories
    ADD CONSTRAINT "PK_b5ed459835d67814f109280943b" PRIMARY KEY (id);


--
-- Name: weekly_report_comment PK_b94f505dfe0fcedd44ef8279adf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_report_comment
    ADD CONSTRAINT "PK_b94f505dfe0fcedd44ef8279adf" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: budget_comment PK_c78850781f68b7973251a1305ee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_comment
    ADD CONSTRAINT "PK_c78850781f68b7973251a1305ee" PRIMARY KEY (id);


--
-- Name: budget_type PK_d2bd75b8bff0231708373829a86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_type
    ADD CONSTRAINT "PK_d2bd75b8bff0231708373829a86" PRIMARY KEY (id);


--
-- Name: risks PK_df437126f5dd05e856b8bf7157f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT "PK_df437126f5dd05e856b8bf7157f" PRIMARY KEY (id);


--
-- Name: payment_term PK_e06d6ccc9db17416919b5f46d6d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_term
    ADD CONSTRAINT "PK_e06d6ccc9db17416919b5f46d6d" PRIMARY KEY (id);


--
-- Name: mom_attendees PK_eb020044c07fb1fb10c34b80e5d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_attendees
    ADD CONSTRAINT "PK_eb020044c07fb1fb10c34b80e5d" PRIMARY KEY ("userId", "momId");


--
-- Name: clients PK_f1ab7cf3a5714dbc6bb4e1c28a4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY (id);


--
-- Name: lessonLearned PK_f25c7997d193b2718c67bbfe0c1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."lessonLearned"
    ADD CONSTRAINT "PK_f25c7997d193b2718c67bbfe0c1" PRIMARY KEY (id);


--
-- Name: taskUser PK_ff23ed308dd22eab55b7bfda8da; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."taskUser"
    ADD CONSTRAINT "PK_ff23ed308dd22eab55b7bfda8da" PRIMARY KEY ("taskId", "userId");


--
-- Name: IDX_16a7148e444d94e687dea41ecd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_16a7148e444d94e687dea41ecd" ON public."AAA_Department" USING btree ("afterActionAnalysisId");


--
-- Name: IDX_4192284ac9dc69776e3393f3d4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4192284ac9dc69776e3393f3d4" ON public."AAA_Department" USING btree ("departmentId");


--
-- Name: IDX_7115f82a61e31ac95b2681d83e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7115f82a61e31ac95b2681d83e" ON public.project_member USING btree ("projectId");


--
-- Name: IDX_97d0fff79d22c6d549b39f5f50; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_97d0fff79d22c6d549b39f5f50" ON public."taskUser" USING btree ("userId");


--
-- Name: IDX_b70addac7b9b744795aa029d29; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b70addac7b9b744795aa029d29" ON public.mom_attendees USING btree ("momId");


--
-- Name: IDX_d70b96eb12a02521c4592cd0f6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d70b96eb12a02521c4592cd0f6" ON public.mom_attendees USING btree ("userId");


--
-- Name: IDX_dda14e415bff03e9db6a3f79ce; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_dda14e415bff03e9db6a3f79ce" ON public."budgetGroupComment" USING btree ("budgetCommentId");


--
-- Name: IDX_e7520163dafa7c1104fd672caa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e7520163dafa7c1104fd672caa" ON public.project_member USING btree ("userId");


--
-- Name: IDX_f97e417197622794b3690508d2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f97e417197622794b3690508d2" ON public."taskUser" USING btree ("taskId");


--
-- Name: IDX_fae90fbee5437f671db7379894; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fae90fbee5437f671db7379894" ON public."budgetGroupComment" USING btree ("budgetGroupId");


--
-- Name: llComments FK_01b3d964cf2cd79d73a61fcf887; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."llComments"
    ADD CONSTRAINT "FK_01b3d964cf2cd79d73a61fcf887" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: weekly_report_comment FK_05d6a1525fb845101a4bf7a997b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_report_comment
    ADD CONSTRAINT "FK_05d6a1525fb845101a4bf7a997b" FOREIGN KEY ("weeklyReportId") REFERENCES public.weekly_report(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects FK_091f9433895a53408cb8ae3864f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "FK_091f9433895a53408cb8ae3864f" FOREIGN KEY ("clientId") REFERENCES public.clients(id);


--
-- Name: minute_of_meetings FK_0ccf552d3d693fee53a104b5705; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minute_of_meetings
    ADD CONSTRAINT "FK_0ccf552d3d693fee53a104b5705" FOREIGN KEY ("projectId") REFERENCES public.projects(id);


--
-- Name: AAA_Department FK_16a7148e444d94e687dea41ecdc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AAA_Department"
    ADD CONSTRAINT "FK_16a7148e444d94e687dea41ecdc" FOREIGN KEY ("afterActionAnalysisId") REFERENCES public."afterActionAnalysis"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budget FK_1a6497acec02f0efd6ad7301a3c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT "FK_1a6497acec02f0efd6ad7301a3c" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_member FK_1bd970e9c26bc7b18bbfe07e152; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_member
    ADD CONSTRAINT "FK_1bd970e9c26bc7b18bbfe07e152" FOREIGN KEY ("roleId") REFERENCES public.roles(id);


--
-- Name: monthly_budgets FK_1dd46f458552b97b74327228ae7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budgets
    ADD CONSTRAINT "FK_1dd46f458552b97b74327228ae7" FOREIGN KEY ("approvalStageId") REFERENCES public.approval_stage(id);


--
-- Name: lessonLearned FK_1ffd569691dae60d0d91766d341; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."lessonLearned"
    ADD CONSTRAINT "FK_1ffd569691dae60d0d91766d341" FOREIGN KEY ("departmentId") REFERENCES public.department(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: weekly_report FK_2478523bc4d569c9d440053a6e7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_report
    ADD CONSTRAINT "FK_2478523bc4d569c9d440053a6e7" FOREIGN KEY ("projectId") REFERENCES public.projects(id);


--
-- Name: payment_term FK_2e089efdcf75a08460d2efe1d59; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_term
    ADD CONSTRAINT "FK_2e089efdcf75a08460d2efe1d59" FOREIGN KEY ("budgetTypeId") REFERENCES public.budget_type(id);


--
-- Name: resourcehistories FK_2e8093d36d486204e5a6348a3fd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resourcehistories
    ADD CONSTRAINT "FK_2e8093d36d486204e5a6348a3fd" FOREIGN KEY ("taskId") REFERENCES public.tasks(id);


--
-- Name: baselines FK_2f79ea06e592fa7e52018609bd1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baselines
    ADD CONSTRAINT "FK_2f79ea06e592fa7e52018609bd1" FOREIGN KEY ("approvalStageId") REFERENCES public.approval_stage(id);


--
-- Name: minute_of_meetings FK_312deb14142a25aadc873e35090; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minute_of_meetings
    ADD CONSTRAINT "FK_312deb14142a25aadc873e35090" FOREIGN KEY ("facilitatorId") REFERENCES public.users(id);


--
-- Name: project_contract_values FK_31df25b51ec16cb3f941430f0eb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_contract_values
    ADD CONSTRAINT "FK_31df25b51ec16cb3f941430f0eb" FOREIGN KEY ("currencyId") REFERENCES public.currency(id);


--
-- Name: budget FK_321874f0e50c70cd6664195561f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT "FK_321874f0e50c70cd6664195561f" FOREIGN KEY ("groupId") REFERENCES public.budget_group(id);


--
-- Name: budget FK_3662d14e2ff13667d82d421299d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT "FK_3662d14e2ff13667d82d421299d" FOREIGN KEY ("projectId") REFERENCES public.projects(id);


--
-- Name: users FK_368e146b785b574f42ae9e53d5e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES public.roles(id);


--
-- Name: mom_action_responsible FK_3c79076f615ca010257c649a904; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_action_responsible
    ADD CONSTRAINT "FK_3c79076f615ca010257c649a904" FOREIGN KEY ("momActionId") REFERENCES public.mom_actions(id);


--
-- Name: AAA_Department FK_4192284ac9dc69776e3393f3d48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AAA_Department"
    ADD CONSTRAINT "FK_4192284ac9dc69776e3393f3d48" FOREIGN KEY ("departmentId") REFERENCES public.department(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mom_agenda_topic FK_43e90186481a8e65b545bdaa7b9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_agenda_topic
    ADD CONSTRAINT "FK_43e90186481a8e65b545bdaa7b9" FOREIGN KEY ("agendaId") REFERENCES public.mom_agenda(id);


--
-- Name: payment_term FK_44e90acb8f49cdbe3773bf9f049; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_term
    ADD CONSTRAINT "FK_44e90acb8f49cdbe3773bf9f049" FOREIGN KEY ("currencyId") REFERENCES public.currency(id);


--
-- Name: mom_action_responsible FK_45e1da8939a13eb51e4ac57336c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_action_responsible
    ADD CONSTRAINT "FK_45e1da8939a13eb51e4ac57336c" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: budget FK_46a2082cc981625bb3e4ca6b824; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT "FK_46a2082cc981625bb3e4ca6b824" FOREIGN KEY ("budgetCategoryId") REFERENCES public.budget_category(id);


--
-- Name: tasks FK_4f30427b547308af631c125f5e0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "FK_4f30427b547308af631c125f5e0" FOREIGN KEY ("baselineId") REFERENCES public.baselines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mom_agenda FK_505dbd9ea4d872e5d9dd7361fd8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_agenda
    ADD CONSTRAINT "FK_505dbd9ea4d872e5d9dd7361fd8" FOREIGN KEY ("momId") REFERENCES public.minute_of_meetings(id);


--
-- Name: payment_term FK_51a1d88e2f6c4e4093c45b683bc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_term
    ADD CONSTRAINT "FK_51a1d88e2f6c4e4093c45b683bc" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: afterActionAnalysis FK_57d9c3365f7995ce172a711d044; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."afterActionAnalysis"
    ADD CONSTRAINT "FK_57d9c3365f7995ce172a711d044" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budget_task_category FK_58ef357801456462a5610e3b626; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_task_category
    ADD CONSTRAINT "FK_58ef357801456462a5610e3b626" FOREIGN KEY ("budgetTypeId") REFERENCES public.budget_type(id);


--
-- Name: budget FK_5f8d7e3034cc9115fa1e4f42f3f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT "FK_5f8d7e3034cc9115fa1e4f42f3f" FOREIGN KEY ("currencyId") REFERENCES public.currency(id);


--
-- Name: project_contract_values FK_609a9a273f87ecc2b42154a383b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_contract_values
    ADD CONSTRAINT "FK_609a9a273f87ecc2b42154a383b" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: milestones FK_662a1f9d865fe49768fa369fd0f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT "FK_662a1f9d865fe49768fa369fd0f" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: baselines FK_676d5562698c0126e8bbbabad7b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baselines
    ADD CONSTRAINT "FK_676d5562698c0126e8bbbabad7b" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budget_group FK_6a1b3eb767656ee7e120849e9fe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_group
    ADD CONSTRAINT "FK_6a1b3eb767656ee7e120849e9fe" FOREIGN KEY ("projectId") REFERENCES public.projects(id);


--
-- Name: tasks FK_6dc5020fc4c6814347816455e7a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "FK_6dc5020fc4c6814347816455e7a" FOREIGN KEY ("milestoneId") REFERENCES public.milestones(id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- Name: project_member FK_7115f82a61e31ac95b2681d83e4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_member
    ADD CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: approval_stage FK_72fb7472532c67faedbde8320e9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_stage
    ADD CONSTRAINT "FK_72fb7472532c67faedbde8320e9" FOREIGN KEY ("roleId") REFERENCES public.roles(id);


--
-- Name: risks FK_74849b6ccb5ac008ef53558571d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT "FK_74849b6ccb5ac008ef53558571d" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mom_agenda_topic FK_7e41a093bf7649bf41834d80e70; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_agenda_topic
    ADD CONSTRAINT "FK_7e41a093bf7649bf41834d80e70" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: actions FK_83a924c769f3af304edd00c95d1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT "FK_83a924c769f3af304edd00c95d1" FOREIGN KEY ("authorizedPersonId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: actions FK_90aecda0c77bd5c716f4b95e2ac; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT "FK_90aecda0c77bd5c716f4b95e2ac" FOREIGN KEY ("afterActionAnalysisId") REFERENCES public."afterActionAnalysis"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: milestones FK_94a96ec081b9eae408ca2e1bbf3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT "FK_94a96ec081b9eae408ca2e1bbf3" FOREIGN KEY ("paymentTermId") REFERENCES public.payment_term(id);


--
-- Name: taskUser FK_97d0fff79d22c6d549b39f5f50b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."taskUser"
    ADD CONSTRAINT "FK_97d0fff79d22c6d549b39f5f50b" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: approval_stage FK_988e1227cb30ad35d2b4d11c07f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_stage
    ADD CONSTRAINT "FK_988e1227cb30ad35d2b4d11c07f" FOREIGN KEY ("approvalModuleId") REFERENCES public.approval_module(id);


--
-- Name: mom_actions FK_9a2d631a192d2219305578329b0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_actions
    ADD CONSTRAINT "FK_9a2d631a192d2219305578329b0" FOREIGN KEY ("momId") REFERENCES public.minute_of_meetings(id);


--
-- Name: budget_group FK_9c4b6de1b58c5e1d0fc1897c1b4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_group
    ADD CONSTRAINT "FK_9c4b6de1b58c5e1d0fc1897c1b4" FOREIGN KEY ("approvalStageId") REFERENCES public.approval_stage(id);


--
-- Name: issues FK_9f82fdfad8087663f95e203da67; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT "FK_9f82fdfad8087663f95e203da67" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: weekly_report_comment FK_a1f18c0de38e57a8c2beecec095; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_report_comment
    ADD CONSTRAINT "FK_a1f18c0de38e57a8c2beecec095" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resourcehistories FK_a45d4f43a1e4f15eb161506387d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resourcehistories
    ADD CONSTRAINT "FK_a45d4f43a1e4f15eb161506387d" FOREIGN KEY ("projectId") REFERENCES public.projects(id);


--
-- Name: budget FK_afb866ccfc15ab438b7353f38e2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT "FK_afb866ccfc15ab438b7353f38e2" FOREIGN KEY ("taskCategoryId") REFERENCES public.budget_task_category(id);


--
-- Name: llComments FK_b0657eb64f421c10de275edb087; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."llComments"
    ADD CONSTRAINT "FK_b0657eb64f421c10de275edb087" FOREIGN KEY ("lessonLearnedId") REFERENCES public."lessonLearned"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: actions FK_b248e203faa1d6b13bb6244ebca; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT "FK_b248e203faa1d6b13bb6244ebca" FOREIGN KEY ("responsiblePersonId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mom_attendees FK_b70addac7b9b744795aa029d299; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_attendees
    ADD CONSTRAINT "FK_b70addac7b9b744795aa029d299" FOREIGN KEY ("momId") REFERENCES public.minute_of_meetings(id);


--
-- Name: relatedissues FK_b73896d1c0962ea97784e1a23ff; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.relatedissues
    ADD CONSTRAINT "FK_b73896d1c0962ea97784e1a23ff" FOREIGN KEY ("afterActionAnalysisId") REFERENCES public."afterActionAnalysis"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subtasks FK_bde15cf8f7b07bb4ccad8ef6fa3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subtasks
    ADD CONSTRAINT "FK_bde15cf8f7b07bb4ccad8ef6fa3" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mom_comment FK_c31ca374b7aeebbd8f1ce2ec48d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_comment
    ADD CONSTRAINT "FK_c31ca374b7aeebbd8f1ce2ec48d" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: baseline_comment FK_c3ee505eebe36e3cc2a53a74451; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baseline_comment
    ADD CONSTRAINT "FK_c3ee505eebe36e3cc2a53a74451" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resourcehistories FK_d25a7c6a75c405bdf54902b5c9a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resourcehistories
    ADD CONSTRAINT "FK_d25a7c6a75c405bdf54902b5c9a" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: mom_attendees FK_d70b96eb12a02521c4592cd0f6c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_attendees
    ADD CONSTRAINT "FK_d70b96eb12a02521c4592cd0f6c" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: budgetGroupComment FK_dda14e415bff03e9db6a3f79ce1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."budgetGroupComment"
    ADD CONSTRAINT "FK_dda14e415bff03e9db6a3f79ce1" FOREIGN KEY ("budgetCommentId") REFERENCES public.budget_comment(id);


--
-- Name: baseline_comment FK_ddad8a265d63b7da9cd04f04841; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baseline_comment
    ADD CONSTRAINT "FK_ddad8a265d63b7da9cd04f04841" FOREIGN KEY ("baselineId") REFERENCES public.baselines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: monthly_budget_comments FK_debe9371a36e783d73388d0dd75; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budget_comments
    ADD CONSTRAINT "FK_debe9371a36e783d73388d0dd75" FOREIGN KEY ("monthlyBudgetId") REFERENCES public.monthly_budgets(id);


--
-- Name: project_member FK_e7520163dafa7c1104fd672caad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_member
    ADD CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: individualLL FK_f0ee1704e8957a453b41049c479; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."individualLL"
    ADD CONSTRAINT "FK_f0ee1704e8957a453b41049c479" FOREIGN KEY ("lessonLearnedId") REFERENCES public."lessonLearned"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: lessonLearned FK_f3e9605ff3914d6f04458d22b08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."lessonLearned"
    ADD CONSTRAINT "FK_f3e9605ff3914d6f04458d22b08" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mom_comment FK_f483950284d4dc26c6d1004d8f5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mom_comment
    ADD CONSTRAINT "FK_f483950284d4dc26c6d1004d8f5" FOREIGN KEY ("momId") REFERENCES public.minute_of_meetings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: taskUser FK_f97e417197622794b3690508d27; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."taskUser"
    ADD CONSTRAINT "FK_f97e417197622794b3690508d27" FOREIGN KEY ("taskId") REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budgetGroupComment FK_fae90fbee5437f671db73798949; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."budgetGroupComment"
    ADD CONSTRAINT "FK_fae90fbee5437f671db73798949" FOREIGN KEY ("budgetGroupId") REFERENCES public.budget_group(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

