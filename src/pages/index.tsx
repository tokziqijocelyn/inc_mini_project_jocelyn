import { signIn, signOut, useSession, getSession } from "next-auth/react";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";

import { api } from "~/utils/api";
import Header from "../components/Header";
import FormCreationWizard from "../components/FormCreationWizard";
import { on } from "events";

function NoForms() {
  return (
    <div className="p-5 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No forms</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new form.
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          + New Form
        </button>
      </div>
    </div>
  );
}

const Feed = () => {
  type Form = {
    formName: string;
    formId: string;
    formCreated: string;
  };

  const [form, setForm] = useState([]);
  const {
    data: allForm,
    isLoading: allFormsLoading,
    isError: allFormsError,
  } = api.post.getAllForms.useQuery();

  const {
    mutate: deleteForm,
    isLoading: deleteFormLoading,
    isError: deleteFormError,
  } = api.post.deleteForm.useMutation({
    onSuccess: () => {
      console.log("deleteForm success");
      toast.success("Form deleted successfully");
      ctx.post.getAllForms.invalidate();
    },
    onError: (error) => {
      console.error(error);
      console.log("deleteForm error");
    },
  });

  const ctx = api.useUtils();

  return (
    <div className="  p-5">
      {allFormsLoading && <div>Loading...</div>}
      {allForm?.length == 0 || !allForm ? (
        <NoForms />
      ) : (
        <div className="grid grid-cols-3">
          {allForm.map((data) => (
            <div>
              <div
                className="m-4 flex flex-col items-center gap-5	 rounded-md border border-t-4 border-purple-800 bg-white p-5 text-center shadow-sm hover:cursor-pointer hover:border-2 hover:border-indigo-400"
                key={data.formId}
              >
                <Link href={`/form/${data.formId}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 576 512"
                    className="h-10 w-10"
                  >
                    <path d="M320 192h17.1c22.1 38.3 63.5 64 110.9 64c11 0 21.8-1.4 32-4v4 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V339.2L280 448h56c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-53 0-96-43-96-96V192.5c0-16.1-12-29.8-28-31.8l-7.9-1c-17.5-2.2-30-18.2-27.8-35.7s18.2-30 35.7-27.8l7.9 1c48 6 84.1 46.8 84.1 95.3v85.3c34.4-51.7 93.2-85.8 160-85.8zm160 26.5v0c-10 3.5-20.8 5.5-32 5.5c-28.4 0-54-12.4-71.6-32h0c-3.7-4.1-7-8.5-9.9-13.2C357.3 164 352 146.6 352 128v0V32 12 10.7C352 4.8 356.7 .1 362.6 0h.2c3.3 0 6.4 1.6 8.4 4.2l0 .1L384 21.3l27.2 36.3L416 64h64l4.8-6.4L512 21.3 524.8 4.3l0-.1c2-2.6 5.1-4.2 8.4-4.2h.2C539.3 .1 544 4.8 544 10.7V12 32v96c0 17.3-4.6 33.6-12.6 47.6c-11.3 19.8-29.6 35.2-51.4 42.9zM432 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm48 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
                  </svg>
                  <div className="">{data.formName}</div>
                </Link>
                <div
                  onClick={() => {
                    deleteForm(data.formId);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const session = useSession();

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.status} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
      <Head>
        <title>Form Builder</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link
          rel="icon"
          href="data:image/jpeg;base64,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"
        />
      </Head>

      <main className="min-h-screen">
        {/* <Header /> */}
        <div className="font-lexend">
          <FormCreationWizard />
          <AuthShowcase/>
        </div>
        <Feed />
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-black px-10 py-3 font-semibold text-white no-underline transition hover:bg-white hover:text-black"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
