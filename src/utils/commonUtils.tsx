import { logError, logInfo } from "./logger";

export const handleNetworkError = (message: string,navigation:any) => {
    logError(`Network error: ${message}`);
    navigation.navigate('networkError', {
        message: message,
        onRetry: () => {
            logInfo("Retrying network request...");
            navigation.setParams({retry : Math.random()}); 
            navigation.goBack();
        }
    });
};
