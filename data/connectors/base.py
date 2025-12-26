"""Base connector class for all data sources."""

from abc import ABC, abstractmethod
import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class BaseConnector(ABC):
    """Abstract base class for data connectors.

    All connectors must implement connect() and fetch() methods.
    """

    def __init__(self, config: Dict[str, Any]):
        """Initialize the connector with configuration.

        Args:
            config: Configuration dictionary for the connector
        """
        self.config = config
        self.connected = False
        logger.info(f"Initializing {self.__class__.__name__}")

    @abstractmethod
    def connect(self) -> None:
        """Establish connection to the data source.

        Raises:
            ConnectionError: If connection fails
        """
        pass

    @abstractmethod
    def fetch(self) -> List[Dict[str, Any]]:
        """Fetch data from the source.

        Returns:
            List of dictionaries containing the data

        Raises:
            RuntimeError: If fetch operation fails
        """
        pass

    def disconnect(self) -> None:
        """Disconnect from the data source.

        Override this method if your connector needs cleanup.
        """
        self.connected = False
        logger.info(f"{self.__class__.__name__} disconnected")
