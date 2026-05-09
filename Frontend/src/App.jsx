import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles"; // Note: check if filename matches
import PublicFileView from "./pages/PublicFileView";
import Subscription from "./pages/Subscription";
import Transactions from "./pages/Transactions";
import Upload from "./pages/Upload";
import SavedFiles from "./pages/SavedFiles";
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/SignUpPage";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import WiredToaster from "./components/ui/WiredToaster";
import { UserCreditsProvider } from "./context/UserCreditsContext";

const App = () => {
  return (
    <UserCreditsProvider>
      <BrowserRouter>
        <WiredToaster />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/dashboard" element={
            <>
              <SignedIn><Dashboard /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/my-files" element={
            <>
              <SignedIn><MyFiles /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/saved-files" element={
            <>
              <SignedIn><SavedFiles /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/public-file-view" element={
            <>
              <SignedIn><PublicFileView /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/subscription" element={
            <>
              <SignedIn><Subscription /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/transactions" element={
            <>
              <SignedIn><Transactions /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="file/:fileId" element={
            <>
              <PublicFileView />
            </>
          } />
          <Route path="/upload" element={
            <>
              <SignedIn><Upload /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </UserCreditsProvider>
  );
}
export default App;