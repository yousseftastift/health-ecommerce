
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the HTML homepage
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting to EcoLife...</h1>
        <p className="text-xl text-muted-foreground">If you're not redirected automatically, <a href="/index.html" className="text-blue-500 underline">click here</a></p>
      </div>
    </div>
  );
};

export default Index;
