import "server-only";

type RequiredServerEnvName =
  | "DATABASE_URL"
  | "NEXTAUTH_SECRET"
  | "NEXTAUTH_URL";

type RequiredServerEnvOptions = {
  developmentFallback?: string;
};

function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function getRequiredServerEnv(
  name: RequiredServerEnvName,
  options?: RequiredServerEnvOptions,
) {
  const value = process.env[name]?.trim();

  if (value) {
    return value;
  }

  if (!isProductionRuntime() && options?.developmentFallback) {
    return options.developmentFallback;
  }

  throw new Error(
    `Missing required environment variable ${name}. Set it before starting the app in this environment.`,
  );
}

export function getOptionalServerEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}
